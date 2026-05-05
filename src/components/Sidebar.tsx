import { useState } from 'react'

interface NavItem {
  id: string
  icon: string
  label: string
  dividerBefore?: boolean
}

const NAV: NavItem[] = [
  { id: 'home',     icon: '⚡', label: '홈' },
  { id: 'web',      icon: '🌐', label: '웹',        dividerBefore: true },
  { id: 'app',      icon: '📦', label: '앱' },
  { id: 'exe',      icon: '💻', label: '실행파일' },
  { id: 'settings', icon: '⚙️', label: '설정',      dividerBefore: true },
]

interface Props {
  current: string
  onChange: (id: string) => void
}

export default function Sidebar({ current, onChange }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      style={{
        width: expanded ? 200 : 64,
        margin: '12px 0 12px 12px',
        height: 'calc(100vh - 24px)',
        background: 'linear-gradient(180deg, #1E2B4A 0%, #2A1B5E 100%)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: 12,
        zIndex: 10,
        flexShrink: 0,
        transition: 'width 0.3s',
        boxShadow: '4px 0 24px rgba(30,43,74,0.18), inset -1px 0 0 rgba(111,159,242,0.08)',
      }}
    >
      {/* 로고 / 토글 버튼 */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 6px', marginBottom: 8,
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderRadius: 10,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(111,159,242,0.12)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        title={expanded ? '접기' : '펼치기'}
      >
        <span style={{ fontSize: 22, flexShrink: 0 }}>🚀</span>
        {expanded && (
          <span style={{ fontWeight: 800, fontSize: 13, color: '#A8C5FA', whiteSpace: 'nowrap', letterSpacing: 0.5 }}>
            B-Handless
          </span>
        )}
      </button>

      {/* 네비게이션 */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV.map(item => {
          const active = current === item.id
          return (
            <div key={item.id}>
              {item.dividerBefore && (
                <div style={{
                  height: 1,
                  background: 'rgba(111,159,242,0.15)',
                  margin: '6px 4px',
                }}/>
              )}
              <button
                onClick={() => onChange(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 8px', width: '100%', textAlign: 'left',
                  borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: active
                    ? 'rgba(111,159,242,0.22)'
                    : 'transparent',
                  transition: 'background 0.15s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.background = 'rgba(111,159,242,0.10)'
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.background = 'transparent'
                }}
              >
                {/* 활성 좌측 선 */}
                {active && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: 2,
                    background: 'linear-gradient(180deg, #6F9FF2, #B864D4)',
                  }}/>
                )}
                <span style={{ fontSize: 17, flexShrink: 0, width: 24, textAlign: 'center' }}>
                  {item.icon}
                </span>
                {expanded && (
                  <span style={{
                    fontSize: 13, fontWeight: active ? 700 : 500,
                    color: active ? '#E8F0FF' : '#8DA8CC',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.label}
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </nav>

      {/* 버전 */}
      {expanded && (
        <p style={{ fontSize: 11, textAlign: 'center', color: 'rgba(111,159,242,0.3)', margin: 0 }}>
          v0.3.0
        </p>
      )}
    </aside>
  )
}
