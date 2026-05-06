import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type StartupItem } from '../api'

interface Props {
  item?: StartupItem
  defaultType?: StartupItem['type']
  onClose: () => void
}

const EMPTY = {
  type: 'browser_url' as StartupItem['type'],
  label: '',
  enabled: true,
  delay_seconds: 0,
  url: '',
  browser: 'edge',
  path: '',
  args: [] as string[],
}

export default function ItemModal({ item, defaultType, onClose }: Props) {
  const qc = useQueryClient()
  const isEdit = !!item

  const base = defaultType ? { ...EMPTY, type: defaultType } : EMPTY
  const [form, setForm] = useState({ ...base, ...item })
  const [error, setError] = useState('')

  useEffect(() => { setForm({ ...base, ...item }) }, [item]) // eslint-disable-line react-hooks/exhaustive-deps

  const { data: browsers = [] } = useQuery({
    queryKey: ['browsers'],
    queryFn: api.browsers.list,
  })

  const mut = useMutation({
    mutationFn: () =>
      isEdit
        ? api.items.update(item!.id, form)
        : api.items.add(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items'] })
      onClose()
    },
    onError: (e: Error) => setError(e.message),
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div
        className="glass w-full flex flex-col gap-5 p-6"
        style={{ maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base m-0" style={{ color: '#1E293B' }}>
            {isEdit ? '항목 수정' : '항목 추가'}
          </h2>
          <button className="btn-ghost px-2 py-1 text-sm" onClick={onClose}>✕</button>
        </div>

        {/* 타입 선택 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: '#64748B' }}>타입</label>
          <select
            className="select-glass"
            value={form.type}
            onChange={e => set('type', e.target.value)}
          >
            <option value="browser_url">🌐 웹 URL 열기</option>
            <option value="exe">📂 실행 파일 (EXE)</option>
            <option value="app">📱 앱</option>
          </select>
        </div>

        {/* 라벨 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: '#64748B' }}>이름</label>
          <input
            className="input-glass"
            placeholder="항목 이름"
            value={form.label}
            onChange={e => set('label', e.target.value)}
          />
        </div>

        {/* browser_url 전용 */}
        {form.type === 'browser_url' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: '#64748B' }}>URL</label>
              <input
                className="input-glass"
                placeholder="https://example.com"
                value={form.url}
                onChange={e => set('url', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: '#64748B' }}>브라우저</label>
              <select
                className="select-glass"
                value={form.browser}
                onChange={e => set('browser', e.target.value)}
              >
                {browsers.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.installed ? '✅' : '⚠️'} {b.label}
                    {!b.installed ? ' (미설치 — PC에 설치 필요)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* exe/app 전용 */}
        {(form.type === 'exe' || form.type === 'app') && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: '#64748B' }}>실행 파일 경로</label>
            <input
              className="input-glass"
              placeholder="C:\Program Files\App\app.exe"
              value={form.path}
              onChange={e => set('path', e.target.value)}
            />
          </div>
        )}

        {/* 딜레이 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: '#64748B' }}>
            딜레이 (초) — 부팅 후 이 시간만큼 기다렸다가 실행
          </label>
          <input
            className="input-glass"
            type="number" min={0} step={1}
            value={form.delay_seconds}
            onChange={e => set('delay_seconds', Number(e.target.value))}
          />
        </div>

        {/* 에러 */}
        {error && (
          <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(255,107,107,0.10)', color: '#DC2626' }}>
            {error}
          </p>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <button className="btn-ghost flex-1 py-2 text-sm" onClick={onClose}>취소</button>
          <button
            className="btn-primary flex-1 py-2 text-sm"
            onClick={() => mut.mutate()}
            disabled={mut.isPending || !form.label}
          >
            {mut.isPending ? '저장 중…' : isEdit ? '수정 저장' : '추가'}
          </button>
        </div>
      </div>
    </div>
  )
}
