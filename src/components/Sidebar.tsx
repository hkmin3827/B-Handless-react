import { useState } from 'react'

interface NavItem {
  id: string
  icon: string
  label: string
}

const NAV: NavItem[] = [
  { id: 'home',     icon: '⚡', label: '시작 항목' },
  { id: 'settings', icon: '⚙️', label: '설정' },
]

interface Props {
  current: string
  onChange: (id: string) => void
}

export default function Sidebar({ current, onChange }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      className="glass flex flex-col gap-2 p-3 z-10 transition-all duration-300 shrink-0"
      style={{
        width: expanded ? 200 : 64,
        margin: '12px 0 12px 12px',
        height: 'calc(100vh - 24px)',
      }}
    >
      {/* 로고 / 토글 버튼 */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="btn-ghost flex items-center gap-3 p-2 mb-2"
        title={expanded ? '접기' : '펼치기'}
      >
        <span style={{ fontSize: 22 }}>🚀</span>
        {expanded && (
          <span className="font-bold text-sm whitespace-nowrap" style={{ color: '#6F9FF2' }}>
            B-Handless
          </span>
        )}
      </button>

      {/* 네비게이션 */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="flex items-center gap-3 p-2 rounded-xl transition-all duration-150 text-left"
            style={{
              background: current === item.id
                ? 'linear-gradient(135deg, rgba(111,159,242,0.25), rgba(184,100,212,0.25))'
                : 'transparent',
              border: current === item.id
                ? '1px solid rgba(111,159,242,0.4)'
                : '1px solid transparent',
              color: current === item.id ? '#F5F5F5' : 'rgba(245,245,245,0.55)',
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0, width: 24, textAlign: 'center' }}>
              {item.icon}
            </span>
            {expanded && (
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* 하단 버전 */}
      {expanded && (
        <p className="text-xs text-center" style={{ color: 'rgba(245,245,245,0.25)' }}>
          v0.3.0
        </p>
      )}
    </aside>
  )
}
