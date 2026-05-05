import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type StartupItem } from '../api'
import Toggle from './Toggle'

const TYPE_META: Record<string, { label: string; color: string; icon: string }> = {
  browser_url:  { label: 'URL',    color: '#4D96FF', icon: '🌐' },
  exe:          { label: 'EXE',    color: '#6BCB77', icon: '⚙️' },
  app:          { label: 'APP',    color: '#FF9A3C', icon: '📦' },
  uploaded_exe: { label: 'UPLOAD', color: '#FF6FC8', icon: '📤' },
}

interface Props {
  item: StartupItem
  onEdit: (item: StartupItem) => void
}

export default function ItemCard({ item, onEdit }: Props) {
  const qc = useQueryClient()
  const meta = TYPE_META[item.type] ?? { label: item.type, color: '#9ca3af', icon: '❓' }
  const [running, setRunning] = useState(false)

  const toggleMut = useMutation({
    mutationFn: () => api.items.toggle(item.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  })

  const deleteMut = useMutation({
    mutationFn: () => api.items.delete(item.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  })

  const runNow = async () => {
    setRunning(true)
    try { await api.items.run(item.id) }
    finally { setTimeout(() => setRunning(false), 1200) }
  }

  return (
    <div
      className="glass p-4 flex flex-col gap-3 transition-all duration-200 cursor-default"
      style={{
        opacity: item.enabled ? 1 : 0.55,
        transform: 'translateY(0)',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* 상단: 배지 + 토글 */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: meta.color + '30', color: meta.color, border: `1px solid ${meta.color}55` }}
        >
          {meta.icon} {meta.label}
        </span>
        <Toggle
          on={item.enabled}
          onChange={() => toggleMut.mutate()}
          disabled={toggleMut.isPending}
        />
      </div>

      {/* 라벨 */}
      <p className="font-semibold text-sm leading-snug" style={{ color: '#F5F5F5' }}>
        {item.label}
      </p>

      {/* 부가 정보 */}
      <p className="text-xs truncate" style={{ color: 'rgba(245,245,245,0.45)' }}>
        {item.url ?? item.path ?? '—'}
      </p>

      {item.delay_seconds > 0 && (
        <p className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>
          ⏱ {item.delay_seconds}초 후 실행
        </p>
      )}

      {/* 하단 버튼 */}
      <div className="flex gap-2 mt-1">
        <button
          className="btn-primary text-xs px-3 py-1.5 flex-1"
          onClick={runNow}
          disabled={running}
        >
          {running ? '실행 중…' : '▶ 지금 실행'}
        </button>
        <button
          className="btn-ghost text-xs px-3 py-1.5"
          onClick={() => onEdit(item)}
        >
          ✏️
        </button>
        <button
          className="btn-danger text-xs px-3 py-1.5"
          onClick={() => { if (confirm(`"${item.label}" 항목을 삭제할까요?`)) deleteMut.mutate() }}
          disabled={deleteMut.isPending}
        >
          🗑
        </button>
      </div>
    </div>
  )
}
