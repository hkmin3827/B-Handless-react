export default function HeroGraphic() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes hfloat1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes hfloat2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes hfloat3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-16px)} }
        @keyframes hfloat4 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes hspin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .hf1 { animation: hfloat1 3.6s ease-in-out infinite }
        .hf2 { animation: hfloat2 4.2s ease-in-out infinite 0.4s }
        .hf3 { animation: hfloat3 2.9s ease-in-out infinite 0.8s }
        .hf4 { animation: hfloat4 5s   ease-in-out infinite 0.2s }
        .hgear { animation: hspin 14s linear infinite }
      `}</style>

      <svg viewBox="0 0 560 400" xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', maxWidth: 560, overflow: 'visible' }}>
        <defs>
          <linearGradient id="hScreenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EEF4FF"/>
            <stop offset="100%" stopColor="#F5EEFF"/>
          </linearGradient>
          <linearGradient id="hMonitorSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFF"/>
            <stop offset="100%" stopColor="#EEF0F8"/>
          </linearGradient>
          <radialGradient id="hSphere1" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#A8C5FA"/>
          </radialGradient>
          <radialGradient id="hSphere2" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#D4A8F0"/>
          </radialGradient>
          <radialGradient id="hSphere3" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/>
            <stop offset="100%" stopColor="#FABDDC"/>
          </radialGradient>
          <filter id="hShadow">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#6F9FF2" floodOpacity="0.14"/>
          </filter>
          <filter id="hShadowSm">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#B864D4" floodOpacity="0.12"/>
          </filter>
        </defs>

        {/* 배경 장식 원 */}
        <circle cx="75" cy="75" r="85" fill="#EEF4FF" opacity="0.55"/>
        <circle cx="488" cy="335" r="75" fill="#F5EEFF" opacity="0.55"/>

        {/* ─── 모니터 본체 ─── */}
        <g filter="url(#hShadow)">
          {/* 외곽 프레임 */}
          <rect x="140" y="88" width="280" height="196" rx="14"
            fill="url(#hMonitorSide)" stroke="#DDE3EF" strokeWidth="1.5"/>
          {/* 화면 */}
          <rect x="152" y="100" width="256" height="172" rx="8"
            fill="url(#hScreenGrad)"/>

          {/* 상단 바 */}
          <rect x="152" y="100" width="256" height="24" rx="8"
            fill="white" fillOpacity="0.75"/>
          <circle cx="166" cy="112" r="4" fill="#FABDDC"/>
          <circle cx="178" cy="112" r="4" fill="#FFE0A8"/>
          <circle cx="190" cy="112" r="4" fill="#A8F0C6"/>
          <rect x="206" y="108" width="80" height="8" rx="4"
            fill="#E2E8F0" opacity="0.7"/>

          {/* 미니 카드 1 — 웹 */}
          <rect x="160" y="134" width="74" height="48" rx="7"
            fill="white" fillOpacity="0.9" stroke="#A8C5FA" strokeWidth="1"/>
          <rect x="166" y="141" width="16" height="6" rx="3" fill="#4D96FF"/>
          <text x="185" y="147" fontSize="5.5" fill="#4D96FF" fontWeight="700">WEB</text>
          <rect x="166" y="152" width="54" height="3.5" rx="2" fill="#E2E8F0"/>
          <rect x="166" y="159" width="38" height="3.5" rx="2" fill="#E2E8F0"/>
          <rect x="166" y="168" width="46" height="8" rx="4" fill="#A8C5FA"/>
          <text x="189" y="174" textAnchor="middle" fontSize="5" fill="white" fontWeight="700">▶ 실행</text>

          {/* 미니 카드 2 — 앱 */}
          <rect x="242" y="134" width="74" height="48" rx="7"
            fill="white" fillOpacity="0.9" stroke="#D4A8F0" strokeWidth="1"/>
          <rect x="248" y="141" width="16" height="6" rx="3" fill="#FF9A3C"/>
          <text x="267" y="147" fontSize="5.5" fill="#FF9A3C" fontWeight="700">APP</text>
          <rect x="248" y="152" width="54" height="3.5" rx="2" fill="#E2E8F0"/>
          <rect x="248" y="159" width="38" height="3.5" rx="2" fill="#E2E8F0"/>
          <rect x="248" y="168" width="46" height="8" rx="4" fill="#D4A8F0"/>
          <text x="271" y="174" textAnchor="middle" fontSize="5" fill="white" fontWeight="700">▶ 실행</text>

          {/* 미니 카드 3 — EXE */}
          <rect x="324" y="134" width="74" height="48" rx="7"
            fill="white" fillOpacity="0.9" stroke="#A8F0C6" strokeWidth="1"/>
          <rect x="330" y="141" width="16" height="6" rx="3" fill="#6BCB77"/>
          <text x="349" y="147" fontSize="5.5" fill="#6BCB77" fontWeight="700">EXE</text>
          <rect x="330" y="152" width="54" height="3.5" rx="2" fill="#E2E8F0"/>
          <rect x="330" y="159" width="38" height="3.5" rx="2" fill="#E2E8F0"/>
          <rect x="330" y="168" width="46" height="8" rx="4" fill="#A8F0C6"/>
          <text x="353" y="174" textAnchor="middle" fontSize="5" fill="#1E293B" fontWeight="700">▶ 실행</text>

          {/* 하단 상태바 */}
          <rect x="160" y="192" width="238" height="10" rx="3"
            fill="white" fillOpacity="0.5"/>
          <rect x="160" y="206" width="180" height="10" rx="3"
            fill="white" fillOpacity="0.5"/>
          <rect x="160" y="220" width="238" height="10" rx="3"
            fill="white" fillOpacity="0.5"/>
          <rect x="160" y="234" width="120" height="10" rx="3"
            fill="white" fillOpacity="0.5"/>
          <rect x="160" y="248" width="238" height="14" rx="5"
            fill="url(#hSphere1)" opacity="0.6"/>
        </g>

        {/* 스탠드 */}
        <rect x="268" y="284" width="24" height="18" rx="3" fill="#DDE3EF"/>
        <rect x="250" y="301" width="60" height="6" rx="3" fill="#CBD5E1"/>

        {/* ─── 왼쪽 상단 링 ─── */}
        <g className="hf1" style={{ transformOrigin: '86px 80px' }}>
          <circle cx="86" cy="80" r="40" fill="none" stroke="#A8C5FA"
            strokeWidth="19" opacity="0.88"/>
          <circle cx="86" cy="80" r="40" fill="none" stroke="white"
            strokeWidth="5" opacity="0.45"/>
        </g>

        {/* ─── 오른쪽 상단 구체 ─── */}
        <g className="hf2" style={{ transformOrigin: '480px 90px' }}>
          <circle cx="480" cy="90" r="42" fill="url(#hSphere2)"
            filter="url(#hShadowSm)"/>
          <ellipse cx="468" cy="78" rx="11" ry="6.5" fill="white"
            fillOpacity="0.55" transform="rotate(-28 468 78)"/>
        </g>

        {/* ─── 왼쪽 하단 구체 ─── */}
        <g className="hf3" style={{ transformOrigin: '108px 328px' }}>
          <circle cx="108" cy="328" r="27" fill="url(#hSphere3)"
            filter="url(#hShadowSm)"/>
          <ellipse cx="100" cy="320" rx="7" ry="4" fill="white"
            fillOpacity="0.55" transform="rotate(-28 100 320)"/>
        </g>

        {/* ─── 오른쪽 하단 링 ─── */}
        <g className="hf4" style={{ transformOrigin: '462px 348px' }}>
          <circle cx="462" cy="348" r="31" fill="none" stroke="#FABDDC"
            strokeWidth="15" opacity="0.88"/>
          <circle cx="462" cy="348" r="31" fill="none" stroke="white"
            strokeWidth="4.5" opacity="0.45"/>
        </g>

        {/* ─── 기어 (왼쪽 중단) ─── */}
        <g className="hgear" style={{ transformOrigin: '56px 198px' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <rect key={i} x="50" y="176" width="12" height="10" rx="2.5"
              fill="#D4A8F0" opacity="0.9"
              transform={`rotate(${deg} 56 198)`}/>
          ))}
          <circle cx="56" cy="198" r="13" fill="#D4A8F0"/>
          <circle cx="56" cy="198" r="6.5" fill="white"/>
        </g>

        {/* ─── 로켓 (오른쪽 중단) ─── */}
        <g className="hf2" style={{ transformOrigin: '516px 218px' }}>
          <ellipse cx="516" cy="214" rx="13" ry="22" fill="#A8C5FA"/>
          <circle cx="516" cy="208" r="6" fill="white" fillOpacity="0.8"/>
          <polygon points="503,230 512,238 512,224" fill="#6F9FF2"/>
          <polygon points="529,230 520,238 520,224" fill="#6F9FF2"/>
          <ellipse cx="516" cy="240" rx="5.5" ry="9" fill="#FFE0A8" opacity="0.9"/>
          <ellipse cx="516" cy="240" rx="2.8" ry="5.5" fill="#FF9A3C"/>
        </g>

        {/* ─── 상단 소형 도형들 ─── */}
        <g className="hf1" style={{ transformOrigin: '222px 66px' }}>
          <rect x="210" y="57" width="22" height="22" rx="6"
            fill="#A8F0C6" opacity="0.9" transform="rotate(14 222 68)"/>
        </g>
        <g className="hf3" style={{ transformOrigin: '356px 62px' }}>
          <polygon points="356,50 366,70 346,70" fill="#FFE0A8" opacity="0.9"/>
        </g>

        {/* ─── 레이블 ─── */}
        <text x="280" y="370" textAnchor="middle"
          fontSize="13" fontWeight="800" fill="#6F9FF2" letterSpacing="3">
          B-HANDLESS
        </text>
        <text x="280" y="386" textAnchor="middle"
          fontSize="9.5" fill="#94A3B8" letterSpacing="1.5">
          시작 프로그램 자동 관리
        </text>
      </svg>
    </div>
  )
}
