# ViciousBets — v1 Technical Spec

> Purpose: a build-ready specification for a head-to-head, skill-based statline prediction game using **virtual, non-cashable coins**. Written to be handed directly to Claude Code, one vertical slice at a time. Items marked **[CONFIRM]** are decisions to lock before building the affected module.

---

## 0. Scope of v1

**In scope:** NBA only, virtual coins, public matchmaking + friend challenges, six-prompt statline picks, automated scoring and settlement, ELO + HMR ratings, coin wallet with faucet and rake.

**Out of scope for v1 (defer):** real money of any kind, additional sports, live/in-game picks, play-by-play-based injury timing, cash-out or coin purchases, social feed, chat.

---

## 1. Legal & product posture (read first — it constrains everything)

This is **not** a real-money product, and the design must actively preserve that status:

- Coins are **not purchasable** with real money and **not redeemable** for cash, prizes, or anything of value.
- No UI text, marketing, or metaphor may imply coins have monetary worth. Avoid "deposit," "cash," "$", "withdraw."
- The app should carry an appropriate age rating and a clear "no real money / entertainment only" statement.
- This posture keeps the product in the free-to-play / social-gaming lane and out of gambling classification and app-store rejection.

> Engineering treats coins with money-grade rigor (below). Positioning treats them as explicitly valueless. Keep these two ideas separate.

**Wallet engineering requirements:**
- Integer coin balances only (no floats).
- All coin movements are **atomic transactions** against an **append-only ledger** (debit/credit rows, never mutate a balance in place).
- Every match settlement, faucet grant, and rake charge is a ledger entry with a reason code and match/reference ID.
- Reconciliation invariant: `sum(all ledger entries) == total coins in circulation` at all times.

---

## 2. Glossary

| Term | Meaning |
|---|---|
| **P** | Score for a single prediction, in [0, 1]. |
| **T** | Player's match score = ΣP, a decimal in [0, 6]. See §5. |
| **ELO** | Visible, cosmetic competitive rating. Does not affect matchmaking. |
| **HMR** | Hidden matchmaking rating. Skill estimate; used only for pairing. |
| **EWMA** | Exponentially weighted moving average of a player's T. |
| **Slate** | The set of real games used to generate prompts. |
| **Prompt** | One (player, stat) pair to predict, e.g. "LeBron James – Points." |
| **Tier** | A fixed wager amount both players must match. |
| **Rake** | House cut of the pot (16%). |
| **Faucet** | Periodic free coin grant. |

---

## 3. Data layer (API-NBA)

**Provider:** API-NBA (api-sports.io). **Tier for v1:** **Free** — 100 requests/day, no credit card. Unlike balldontlie's free tier, API-NBA does **not** gate endpoints by plan; player statistics and injuries are available on the free tier, and paid plans (Pro ~$15/mo) only add request volume. This is sufficient to settle matches at prototype scale.

**Why 100 req/day is enough:** with the backend cache below, a full day = ~1 schedule call + one box-score call per finished game (~3–15/day) + injuries — comfortably under 100. Only upgrade when real traffic demands it.

**Architecture rule:** the **backend** owns all API-NBA calls. It polls on a schedule, caches results, and is the single source of truth. Clients never call API-NBA directly.

Backend responsibilities:
- Sync the NBA schedule; identify the "closest slate" (§6).
- After a game ends, pull final player box scores (`players/statistics`); mark stats **final** per §7.
- Pull injury/inactive status (`injuries`) to support void logic (§8).
- Respect the daily quota with caching + backoff; the quota resets at 00:00 UTC and unused requests are lost.

---

## 4. Match lifecycle & states

```
QUEUED → MATCHED → PICKING → LOCKED → LIVE → SETTLING → SETTLED
                       │
                       └── (timeout/one-sided) → VOIDED (refund)
```

- **QUEUED** — player in matchmaking for a chosen sport + tier.
- **MATCHED** — two compatible players paired; server selects one game from the eligible slate and generates six prompts (§6).
- **PICKING** — both players enter predictions. Picks hidden from each other. Window: **5 minutes (LOCKED).**
- **LOCKED** — pick window closed OR both submitted. Picks now revealed to both. Must occur **before game start**.
- **LIVE** — real game in progress. No user action.
- **SETTLING** — game final; backend scores both sets.
- **SETTLED** — winner paid, rake taken, ratings updated, ledger written.
- **VOIDED** — abort + full refund (e.g., a player never submitted; see §9).

Every state transition is timestamped and logged.

---

## 5. Scoring

**Per-prediction score** (from your design, unchanged):

```
P = max(0, 1 − |prediction − actual| / max(actual, 1))
```

- P ∈ [0, 1]. Larger stat categories tolerate larger absolute error.
- If actual = 0, P = 1 only when prediction = 0, else 0.

**Match score T (LOCKED):**

```
T = ΣP   (sum of the six prediction scores)
```

- **T is a decimal**, not an integer. Each P is continuous (e.g., 0.89), so T lands on a real value like 4.28. The **range** is [0, 6]; only the endpoints are whole numbers.
- **Store and compare T at full floating-point precision.** Rounding to an integer would discard the accuracy signal the whole game depends on and would cause frequent artificial ties.
- **Display only:** users see a percentage, `display% = 100 × T / 6`. When prompts void (§8), divide by the number of surviving prompts instead of 6.
- This convention makes the HMR math in §11 (`Diff.Mult = 1 + T/6`) consistent.

**Winner:** higher T wins the pot. Equal T at full precision = tie → §10.

---

## 6. Prompt generation

- On MATCHED, the server randomly selects **one** game from the **eligible** slate (§6.1) and draws **six** prompts from that game's prompt pool.
- Both players receive the **identical** six prompts.
- Prompt pool = eligible (player, stat) pairs for that game. **All box-score stat categories are allowed** (points, rebounds, assists, 3PM, blocks, steals, fouls, turnovers, and any other category API-NBA exposes).
- **Per-stat prediction caps (sanity bounds on user input):** integers only, clamped per category. Recommended defaults — points 0–60, rebounds 0–30, assists 0–25, 3PM 0–15, blocks 0–10, steals 0–10, fouls 0–6, turnovers 0–10. Tune as needed; the scoring formula already self-punishes wild guesses (a huge over-prediction on a low actual drives that P to 0), so caps are mainly for UX sanity.
- **Eligibility filters (enabled):** exclude any player flagged OUT/inactive at pick time, and bias the pool toward likely-active starters and rotation players to avoid dead prompts.

### 6.1 Eligible slate
A game is eligible for a new match only if the full pick window fits before tip-off:
```
now + PICK_WINDOW + SAFETY_BUFFER < game.start_time
```
- If the closest game fails this test, use the **next** game that passes.
- **Matchable horizon (LOCKED): 6 hours.** Only offer games starting within the next 6 hours, so players aren't picking for games a day out. This prevents thin-liquidity weirdness and multi-hour waits before settlement.

---

## 7. Stat finalization & corrections

- A game's stats become **FINAL** when the backend's provider marks them final, or as a fallback **30 minutes after the reported game end**, whichever comes first.
- Matches settle **only** off FINAL stats.
- **Corrections after settlement are NOT reversed.** Once SETTLED, the result stands. (This is the operational meaning of "handle it like PrizePicks/DraftKings" — a defined settlement window, then locked.)

---

## 8. Void / injury rules (v1)

API-NBA's box scores expose **minutes played** per player, and its `injuries` endpoint is available on the free tier. Precise "before vs. after halftime" timing would need play-by-play, so v1 uses a simpler and cheaper **minutes-played proxy**:

- A prompt **voids** if its player played **fewer than 14 minutes** (includes DNPs at 0).
- A voided prompt is dropped from **both** players' sets (both had the same prompt, so this is symmetric and fair).
- Recompute each player's score over the remaining prompts: T = ΣP over surviving prompts, and the display percentage divides by the number of surviving prompts, not always 6.
- **Whole-match void:** if **4 or more of the 6 prompts void** (fewer than 3 gradeable), VOID the match and refund both players.

> Upgrade later: with a play-by-play feed, replace the minutes proxy with the exact "exited before halftime ⇒ void; after halftime ⇒ count" rule.

---

## 9. Matchmaking

**Player selects** sport (NBA) + wager tier **before** queueing.

**Pairing:**
- Only pair players who chose the **same sport and same tier**.
- Among those, pair by **HMR** proximity.
- If no compatible HMR partner, **expand** the acceptable HMR range over time up to a **hard cap of ±400 HMR (LOCKED)** (protects fairness).
- If no match within the **queue timeout of 90s**, notify the player (no match found) and drop from queue.

**Friend challenges:** direct 1v1 at an agreed tier.
- **No rake.** Winner takes the **full pot**; loser's stake transfers to the winner.
- Do **not** affect ELO or HMR (per original design). Purely casual / bragging rights.
- Supply-neutral: no coins created or destroyed, just transferred between the two accounts.

---

## 10. Wager, rake & ties

- Fixed **tiers (LOCKED): 10 / 50 / 100 / 250 coins.**
- Both players debit the tier amount into the pot at LOCK.
- **Win (public match):** winner receives `pot − rake`, where `rake = ceil(0.16 × pot)` — rounded **up, in favor of the house**, so all amounts stay exact integers and `payout + rake == pot`. Rake is a ledger entry to the house account.
  - tier 10 → pot 20 → rake 4 → winner 16
  - tier 50 → pot 100 → rake 16 → winner 84
  - tier 100 → pot 200 → rake 32 → winner 168
  - tier 250 → pot 500 → rake 80 → winner 420
- **Win (friend match):** no rake — winner receives the **full pot** (§9).
- **Tie:** no rake; both players fully refunded their stake.
- A player may only queue a tier they can afford; near-broke players rely on the faucet (§12).

---

## 11. Ratings

### ELO (visible, cosmetic, not used for matchmaking)
`actual` = 1 win / 0.5 draw / 0 loss.
```
Expected = 1 / (1 + 10^((Opp_ELO − Player_ELO) / 400))
New_ELO  = Old_ELO + 16 × (actual − Expected)
```
**Starting ELO (LOCKED): 1000.**

### HMR (hidden, matchmaking only)
Inputs: T (this match), E.T. (rolling expected performance via EWMA), matches_played.

```
EWMA:        E.T_new   = 0.85 × E.T_old + 0.15 × T_current
Delta:       ΔPerf     = T_current − E.T_old
Difficulty:  Diff.Mult = 1 + (T_current / 6)
Sensitivity: K_eff     = K × max(0.3, 1 − matches_played / 20)
                          where K = K_up if ΔPerf ≥ 0 else K_down
Update:      HMR_new   = HMR_old + (K_eff × ΔPerf × Diff.Mult)
```
- Rationale preserved from your doc: recent matches weighted more, but old T still counts (tanking is expensive); near-perfect performances weighted more (harder to improve near the ceiling); new players move faster (the `matches_played/20` decay).
- **Constants (LOCKED):** `K_up = 20`, `K_down = 10` (rises twice as fast as it falls, so tanking is slow and expensive while skill is caught quickly); **starting HMR = 1000**; **starting E.T. = 3.0** (neutral midpoint of the 0–6 range; the EWMA self-corrects within a few matches).

---

## 12. Economy (coins)

- **Starting balance:** 1000 coins.
- **Faucet (LOCKED):** +100 coins every **24 hours**, delivered via an **explicit claim** (the player must tap to claim; no auto-credit), and claimable **only when the player's balance is below 50 coins**. Players at or above 50 coins do not receive the faucet — they must play.
- **Only sink:** the 16% rake. **Only source:** the faucet (broke-player bailout) + the one-time starting grant.

**Balance the loop:** because the faucet is gated to balances under 50, coins only enter circulation when a player is nearly out — active, winning players never claim it. This largely self-limits inflation. The remaining thing to watch is that the smallest tier (10 coins) stays affordable for a player who just topped up from the faucet, which it comfortably is (100-coin top-up ≫ 10-coin tier).

---

## 13. Accounts & anti-abuse (v1 minimum)

- Auth: email or OAuth. One wallet per account.
- Basic multi-account/collusion awareness noted but not heavily engineered in v1 (coins are valueless, lowering incentive).
- Rate-limit faucet claims per account/device.

---

## 14. Suggested build order (hand to Claude Code one slice at a time)

1. **Offline core loop, mock data, virtual coins.** Pick tier → enter 6 predictions (hardcoded prompts) → reveal → score with the P/T formulas (unit-tested) → settle wallet. No backend, no real stats. *Proves the game is fun.*
2. **Backend + wallet.** Supabase/Firebase: accounts, append-only ledger, atomic settlement, faucet.
3. **Matchmaking.** Queue by tier + HMR, expansion, timeout; match state machine (§4).
4. **Real data.** API-NBA (free tier) integration behind the backend cache/poller; slate selection (§6.1); settlement off FINAL stats (§7); void logic (§8).
5. **Ratings.** ELO + HMR (§11) with tests against hand-computed cases.
6. **Polish.** Void/refund edge cases, near-broke UX, error/loading states, age-rating + "no real money" disclosures.

---

## 15. Open decisions checklist ([CONFIRM] items)

- [x] **T convention (LOCKED):** T = ΣP, decimal in [0, 6], stored at full precision, displayed as `100 × T/6` %.
- [x] **Stat categories (LOCKED):** all box-score categories allowed; per-stat input caps set (§6); eligibility filters enabled.
- [x] **PICK_WINDOW (LOCKED):** 5 min. **[CONFIRM]** SAFETY_BUFFER before tip-off (proposed 5 min).
- [x] **Matchable horizon (LOCKED):** 6 hours.
- [x] **Stat-final fallback (LOCKED):** 30 min after game end.
- [x] **Void thresholds (LOCKED):** prompt voids under 14 min played; whole match voids at 4-of-6.
- [x] **Queue timeout (LOCKED):** 90s. HMR expansion cap (LOCKED): ±400.
- [x] **Wager & rake (LOCKED):** tiers 10/50/100/250; rake = `ceil(0.16 × pot)`, rounded up in house's favor.
- [x] **Ratings (LOCKED):** starting ELO 1000; starting HMR 1000; starting E.T. 3.0; K_up 20; K_down 10.
- [x] **Faucet (LOCKED):** +100 coins / 24h, explicit claim, only when balance < 50.
- [x] **Friend matches (LOCKED):** no rake (winner takes full pot); no ELO/HMR impact.
