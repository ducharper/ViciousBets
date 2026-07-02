function BackgroundScene() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes drift{0%{transform:translateX(0)}100%{transform:translateX(28px)}}
        @keyframes drift2{0%{transform:translateX(0)}100%{transform:translateX(-22px)}}
        @keyframes flicker{0%,100%{opacity:0.9}40%{opacity:0.3}70%{opacity:1}}
        @keyframes flicker2{0%,100%{opacity:0.7}30%{opacity:1}60%{opacity:0.2}}
        @keyframes flicker3{0%,100%{opacity:0.8}50%{opacity:0.1}80%{opacity:0.9}}
        @keyframes tailwag{0%,100%{transform:rotate(0deg)}50%{transform:rotate(12deg)}}
        @keyframes birdfly{0%{transform:translate(0,0)}25%{transform:translate(12px,-4px)}50%{transform:translate(24px,0)}75%{transform:translate(12px,3px)}100%{transform:translate(0,0)}}
        .cloud1{animation:drift 20s linear infinite alternate;}
        .cloud2{animation:drift2 26s linear infinite alternate;}
        .firefly1{animation:flicker 2.1s ease-in-out infinite;}
        .firefly2{animation:flicker2 1.7s ease-in-out infinite;}
        .firefly3{animation:flicker3 2.8s ease-in-out infinite;}
        .firefly4{animation:flicker 3.2s ease-in-out infinite 0.4s;}
        .firefly5{animation:flicker2 1.9s ease-in-out infinite 0.8s;}
        .firefly6{animation:flicker3 2.4s ease-in-out infinite 1.2s;}
        .firefly7{animation:flicker 2.6s ease-in-out infinite 0.2s;}
        .firefly8{animation:flicker2 3s ease-in-out infinite 0.6s;}
        .fox-tail{animation:tailwag 2s ease-in-out infinite;transform-origin:bottom left;}
        .bird{animation:birdfly 4s ease-in-out infinite;}
        .bird2{animation:birdfly 5s ease-in-out infinite 1s;}
        .bird3{animation:birdfly 3.5s ease-in-out infinite 2s;}
      `}</style>

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 680 440"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5ECD7" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#F5ECD7" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="ff-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A8E6A3" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#A8E6A3" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* sky */}
        <rect x="0" y="0" width="680" height="440" fill="#0F1E2E"/>

        {/* moon */}
        <ellipse cx="88" cy="65" rx="55" ry="55" fill="#1A2F45" opacity="0.8"/>
        <circle cx="88" cy="65" r="26" fill="#F5ECD7" opacity="0.92"/>
        <circle cx="100" cy="56" r="21" fill="#0F1E2E"/>
        <ellipse cx="88" cy="65" rx="70" ry="70" fill="url(#moon-glow)"/>

        {/* stars */}
        <circle cx="180" cy="28" r="1.5" fill="#F5ECD7" opacity="0.9"/>
        <circle cx="210" cy="15" r="1" fill="#F5ECD7" opacity="0.7"/>
        <circle cx="255" cy="32" r="1.5" fill="#F5ECD7" opacity="0.8"/>
        <circle cx="300" cy="12" r="1" fill="#F5ECD7" opacity="0.6"/>
        <circle cx="340" cy="40" r="2" fill="#F5ECD7" opacity="0.5"/>
        <circle cx="390" cy="18" r="1.5" fill="#F5ECD7" opacity="0.85"/>
        <circle cx="445" cy="35" r="1" fill="#F5ECD7" opacity="0.7"/>
        <circle cx="490" cy="10" r="1.5" fill="#F5ECD7" opacity="0.9"/>
        <circle cx="535" cy="28" r="1" fill="#F5ECD7" opacity="0.6"/>
        <circle cx="580" cy="20" r="2" fill="#F5ECD7" opacity="0.75"/>
        <circle cx="625" cy="45" r="1.5" fill="#F5ECD7" opacity="0.8"/>
        <circle cx="655" cy="18" r="1" fill="#F5ECD7" opacity="0.6"/>
        <circle cx="152" cy="50" r="1" fill="#F5ECD7" opacity="0.5"/>
        <circle cx="440" cy="55" r="1" fill="#F5ECD7" opacity="0.4"/>
        <circle cx="600" cy="55" r="1.5" fill="#F5ECD7" opacity="0.6"/>

        {/* clouds */}
        <g className="cloud1" opacity="0.35">
          <ellipse cx="460" cy="72" rx="48" ry="16" fill="#B8D4E8"/>
          <ellipse cx="435" cy="78" rx="30" ry="13" fill="#B8D4E8"/>
          <ellipse cx="488" cy="79" rx="34" ry="12" fill="#B8D4E8"/>
        </g>
        <g className="cloud2" opacity="0.25">
          <ellipse cx="210" cy="58" rx="38" ry="13" fill="#B8D4E8"/>
          <ellipse cx="188" cy="63" rx="24" ry="10" fill="#B8D4E8"/>
          <ellipse cx="234" cy="64" rx="27" ry="10" fill="#B8D4E8"/>
        </g>

        {/* distant hill + castle */}
        <ellipse cx="340" cy="200" rx="200" ry="100" fill="#1A3A2A"/>
        <ellipse cx="340" cy="200" rx="180" ry="88" fill="#1F4232"/>
        <rect x="296" y="122" width="16" height="55" fill="#0F1E2E"/>
        <rect x="322" y="110" width="22" height="67" fill="#0F1E2E"/>
        <rect x="354" y="122" width="16" height="55" fill="#0F1E2E"/>
        <rect x="312" y="133" width="50" height="44" fill="#0F1E2E"/>
        <rect x="293" y="116" width="22" height="8" fill="#0F1E2E"/>
        <rect x="319" y="104" width="28" height="8" fill="#0F1E2E"/>
        <rect x="351" y="116" width="22" height="8" fill="#0F1E2E"/>
        <rect x="295" y="110" width="3" height="9" fill="#E07A8F"/>
        <rect x="321" y="98" width="3" height="9" fill="#F4C97A"/>
        <rect x="353" y="110" width="3" height="9" fill="#E07A8F"/>
        <rect x="330" y="152" width="14" height="25" fill="#1F4232"/>
        <rect x="314" y="140" width="9" height="7" fill="#F4C97A" opacity="0.5"/>
        <rect x="351" y="142" width="9" height="7" fill="#F4C97A" opacity="0.35"/>

        {/* side hills */}
        <ellipse cx="120" cy="250" rx="130" ry="55" fill="#1A3A2A"/>
        <ellipse cx="560" cy="258" rx="140" ry="58" fill="#1A3A2A"/>

        {/* rolling foreground */}
        <path d="M0 290 Q80 255 160 278 Q240 302 320 272 Q400 242 480 272 Q560 302 640 275 Q660 267 680 270 L680 440 L0 440 Z" fill="#2D6A4F"/>
        <path d="M0 318 Q110 295 220 312 Q330 330 440 305 Q550 280 680 308 L680 440 L0 440 Z" fill="#3A7D5A"/>
        <path d="M0 355 Q170 338 340 352 Q510 366 680 348 L680 440 L0 440 Z" fill="#4A9B6F"/>
        <path d="M0 385 Q200 372 400 382 Q540 390 680 375 L680 440 L0 440 Z" fill="#52B07A"/>

        {/* stag */}
        <g transform="translate(148, 235)">
          <ellipse cx="0" cy="0" rx="10" ry="6" fill="#1A3A2A"/>
          <rect x="-4" y="-18" width="7" height="18" fill="#1A3A2A" rx="1"/>
          <rect x="-10" y="-28" width="5" height="14" fill="#1A3A2A" rx="1"/>
          <rect x="5" y="-25" width="5" height="12" fill="#1A3A2A" rx="1"/>
          <path d="M-14 -28 Q-18 -38 -12 -32" stroke="#1A3A2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M-10 -30 Q-8 -42 -4 -34" stroke="#1A3A2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M8 -26 Q10 -38 14 -30" stroke="#1A3A2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M6 -28 Q14 -40 16 -32" stroke="#1A3A2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <rect x="-8" y="0" width="5" height="18" fill="#1A3A2A" rx="1"/>
          <rect x="0" y="0" width="5" height="20" fill="#1A3A2A" rx="1"/>
          <path d="M8 -4 Q22 0 16 4" stroke="#1A3A2A" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </g>

        {/* deer */}
        <g transform="translate(510, 295)">
          <ellipse cx="0" cy="0" rx="7" ry="4" fill="#1A3A2A"/>
          <rect x="-3" y="-12" width="5" height="12" fill="#1A3A2A" rx="1"/>
          <rect x="-7" y="-18" width="3.5" height="9" fill="#1A3A2A" rx="1"/>
          <rect x="3" y="-16" width="3.5" height="8" fill="#1A3A2A" rx="1"/>
          <path d="M-9 -18 Q-11 -26 -7 -20" stroke="#1A3A2A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M-7 -19 Q-5 -28 -2 -21" stroke="#1A3A2A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M5 -17 Q7 -26 9 -19" stroke="#1A3A2A" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <rect x="-6" y="0" width="3.5" height="12" fill="#1A3A2A" rx="1"/>
          <rect x="1" y="0" width="3.5" height="13" fill="#1A3A2A" rx="1"/>
          <path d="M5 -3 Q14 0 10 3" stroke="#1A3A2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </g>

        {/* fox */}
        <g transform="translate(48, 340)">
          <ellipse cx="12" cy="0" rx="16" ry="9" fill="#1A3A2A"/>
          <ellipse cx="0" cy="-4" rx="9" ry="8" fill="#1A3A2A"/>
          <rect x="6" y="0" width="5" height="14" fill="#1A3A2A" rx="1"/>
          <rect x="14" y="0" width="5" height="16" fill="#1A3A2A" rx="1"/>
          <rect x="22" y="1" width="4" height="13" fill="#1A3A2A" rx="1"/>
          <g>
            <path d="M28 0 Q48 -6 52 8 Q48 16 36 12 Q28 10 28 0" fill="#1A3A2A">
                <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 28 0; 12 28 0; 0 28 0"
                dur="2s"
                repeatCount="indefinite"
                />
            </path>
            <ellipse cx="50" cy="11" rx="4" ry="3" fill="#F5ECD7" opacity="0.3"/>
          </g>
          <path d="M-7 -13 L-10 -18" stroke="#1A3A2A" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M2 -14 L2 -20" stroke="#1A3A2A" strokeWidth="2.5" strokeLinecap="round"/>
        </g>

        {/* owl */}
        <g transform="translate(600, 165)">
          <ellipse cx="0" cy="0" rx="12" ry="14" fill="#1A3A2A"/>
          <ellipse cx="0" cy="-12" rx="9" ry="10" fill="#1A3A2A"/>
          <circle cx="-4" cy="-14" r="3" fill="#F4C97A" opacity="0.7"/>
          <circle cx="4" cy="-14" r="3" fill="#F4C97A" opacity="0.7"/>
          <circle cx="-4" cy="-14" r="1.5" fill="#0F1E2E"/>
          <circle cx="4" cy="-14" r="1.5" fill="#0F1E2E"/>
          <path d="M-14 -2 Q-22 6 -18 12" stroke="#1A3A2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M14 -2 Q22 6 18 12" stroke="#1A3A2A" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M-3 -8 L0 -5 L3 -8" stroke="#F4C97A" strokeWidth="1.5" fill="none" opacity="0.8"/>
        </g>

        {/* birds */}
        <g className="bird" transform="translate(420, 88)">
          <path d="M0 0 Q8 -6 16 0" stroke="#0F1E2E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M0 0 Q-8 -5 -16 1" stroke="#0F1E2E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </g>
        <g className="bird2" transform="translate(460, 75)">
          <path d="M0 0 Q7 -5 14 0" stroke="#0F1E2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M0 0 Q-7 -4 -14 1" stroke="#0F1E2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>
        <g className="bird3" transform="translate(440, 100)">
          <path d="M0 0 Q6 -4 12 0" stroke="#0F1E2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M0 0 Q-6 -3 -12 1" stroke="#0F1E2E" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </g>

        {/* fireflies */}
        <circle className="firefly1" cx="220" cy="295" r="3" fill="#A8E6A3"/>
        <circle cx="220" cy="295" r="8" fill="url(#ff-glow)" opacity="0.6"/>
        <circle className="firefly2" cx="280" cy="312" r="2.5" fill="#A8E6A3"/>
        <circle cx="280" cy="312" r="7" fill="url(#ff-glow)" opacity="0.5"/>
        <circle className="firefly3" cx="360" cy="288" r="3" fill="#A8E6A3"/>
        <circle cx="360" cy="288" r="8" fill="url(#ff-glow)" opacity="0.55"/>
        <circle className="firefly4" cx="195" cy="320" r="2" fill="#A8E6A3"/>
        <circle cx="195" cy="320" r="6" fill="url(#ff-glow)" opacity="0.45"/>
        <circle className="firefly5" cx="420" cy="300" r="3" fill="#A8E6A3"/>
        <circle cx="420" cy="300" r="8" fill="url(#ff-glow)" opacity="0.6"/>
        <circle className="firefly6" cx="470" cy="318" r="2.5" fill="#A8E6A3"/>
        <circle cx="470" cy="318" r="7" fill="url(#ff-glow)" opacity="0.5"/>
        <circle className="firefly7" cx="310" cy="302" r="2" fill="#C8F0C4"/>
        <circle cx="310" cy="302" r="6" fill="url(#ff-glow)" opacity="0.4"/>
        <circle className="firefly8" cx="390" cy="310" r="2.5" fill="#A8E6A3"/>
        <circle cx="390" cy="310" r="7" fill="url(#ff-glow)" opacity="0.5"/>

        {/* foreground bushes */}
        <ellipse cx="90" cy="360" rx="22" ry="9" fill="#3A7D5A"/>
        <ellipse cx="70" cy="356" rx="15" ry="8" fill="#3A7D5A"/>
        <ellipse cx="112" cy="356" rx="16" ry="7" fill="#3A7D5A"/>
        <ellipse cx="560" cy="368" rx="20" ry="8" fill="#3A7D5A"/>
        <ellipse cx="580" cy="364" rx="15" ry="7" fill="#3A7D5A"/>

        {/* wildflowers */}
        <circle cx="170" cy="373" r="3" fill="#E07A8F" opacity="0.7"/>
        <circle cx="245" cy="362" r="2.5" fill="#7B5EA7" opacity="0.8"/>
        <circle cx="430" cy="368" r="3" fill="#E07A8F" opacity="0.6"/>
        <circle cx="500" cy="378" r="2.5" fill="#F4C97A" opacity="0.7"/>
        <circle cx="320" cy="370" r="2" fill="#7B5EA7" opacity="0.6"/>
      </svg>
    </div>
  )
}

export default BackgroundScene