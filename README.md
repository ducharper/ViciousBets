# ViciousBets — Milestone 1

Offline React Native (Expo + TypeScript) prototype of the core match loop.

## Requirements

- Node.js 20+
- Expo CLI: `npm install -g expo-cli` (or use `npx expo`)
- iOS Simulator / Android emulator, or the Expo Go app

## Setup

```bash
npm install
```

## Run

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `i` for iOS simulator / `a` for Android.

## Test

```bash
npm test
```

All 39 Jest tests cover:
- `scoring.ts` — `predictionScore`, `matchScore`
- `voids.ts` — prompt void detection, whole-match-void (≥4 voids)
- `wager.ts` — rake calculation (ceil 16%), settle payouts, TIE/VOID refunds
- `wallet.ts` — in-memory ledger, atomic apply, seed balance
- `faucet.ts` — balance threshold + cooldown gating

## What's mocked

- **Opponent picks**: deterministic pseudo-random picks from a seeded function.
- **Actual results**: deterministic mock actuals; prompt index 3 always plays <14 min to exercise void logic.
- **Players/stats**: static roster of 8 NBA players across 6 stat categories (Points, Rebounds, Assists, Steals, Blocks, Turnovers).
- **Matchmaking**: no queue or real opponent — opponent is simulated locally.
- **No persistence**: all state lives in React context; resetting the app resets the wallet to 1000 coins.

## Out of scope (M1)

Real matchmaking, ELO/HMR, live stats API, auth, backend, injury data.
