import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type AppSearchResult, type StartupItem } from '../api'

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

function AppResultRow({ app, onSelect }: { app: AppSearchResult; onSelect: (a: AppSearchResult) => void }) {
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {
    api.apps.icon(app.path).then(r => setIcon(r.icon)).catch(() => {})
  }, [app.path])

  return (
    <button
      onClick={() => onSelect(app)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 10px', borderRadius: 8,
        border: 'none', background: 'transparent',
        cursor: 'pointer', textAlign: 'left', width: '100%',
        transition: 'background 0.12s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(111,159,242,0.12)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {icon
        ? <img src={`data:image/png;base64,${icon}`} style={{ width: 24, height: 24, flexShrink: 0 }} alt="" />
        : <div style={{ width: 24, height: 24, borderRadius: 4, background: 'rgba(111,159,242,0.15)', flexShrink: 0 }} />
      }
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {app.name}
        </span>
        <span style={{ fontSize: 10, color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {app.path}
        </span>
      </div>
    </button>
  )
}

export default function ItemModal({ item, defaultType, onClose }: Props) {
  const qc = useQueryClient()
  const isEdit = !!item

  const base = defaultType ? { ...EMPTY, type: defaultType } : EMPTY
  const [form, setForm] = useState({ ...base, ...item })
  const [error, setError] = useState('')
  const [appInputMode, setAppInputMode] = useState<'manual' | 'search'>('search')
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState<AppSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const handleSearchChange = (q: string) => {
    setSearchQ(q)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (!q.trim()) { setSearchResults([]); return }
    setSearching(true)
    searchTimer.current = setTimeout(async () => {
      try {
        const results = await api.apps.search(q)
        setSearchResults(results)
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
  }

  const selectApp = (app: AppSearchResult) => {
    set('path', app.path)
    if (!form.label) set('label', app.name)
    setAppInputMode('manual')
    setSearchQ('')
    setSearchResults([])
  }

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
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium" style={{ color: '#64748B' }}>실행 파일 경로</label>
              {form.type === 'app' && (
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['search', 'manual'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setAppInputMode(mode)}
                      style={{
                        fontSize: 11, padding: '2px 10px', borderRadius: 6,
                        border: '1px solid',
                        borderColor: appInputMode === mode ? '#6F9FF2' : 'rgba(111,159,242,0.25)',
                        background: appInputMode === mode ? 'rgba(111,159,242,0.15)' : 'transparent',
                        color: appInputMode === mode ? '#4D7FE8' : '#94A3B8',
                        cursor: 'pointer', fontWeight: appInputMode === mode ? 700 : 400,
                        transition: 'all 0.15s',
                      }}
                    >
                      {mode === 'manual' ? '직접 입력' : '🔍 앱 검색'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 직접 입력 */}
            {(form.type === 'exe' || appInputMode === 'manual') && (
              <input
                className="input-glass"
                placeholder="C:\Program Files\App\app.exe"
                value={form.path}
                onChange={e => set('path', e.target.value)}
              />
            )}

            {/* 앱 검색 */}
            {form.type === 'app' && appInputMode === 'search' && (
              <div className="flex flex-col gap-2">
                <input
                  className="input-glass"
                  placeholder="앱 이름을 입력하세요 (예: Chrome, KakaoTalk)"
                  value={searchQ}
                  onChange={e => handleSearchChange(e.target.value)}
                  autoFocus
                />
                {searching && (
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, textAlign: 'center' }}>검색 중…</p>
                )}
                {!searching && searchResults.length > 0 && (
                  <div style={{
                    maxHeight: 220, overflowY: 'auto',
                    display: 'flex', flexDirection: 'column', gap: 2,
                    borderRadius: 10,
                    border: '1px solid rgba(111,159,242,0.2)',
                    background: 'rgba(255,255,255,0.6)',
                    padding: 4,
                  }}>
                    {searchResults.map((app, i) => (
                      <AppResultRow key={i} app={app} onSelect={selectApp} />
                    ))}
                  </div>
                )}
                {!searching && searchQ.trim() && searchResults.length === 0 && (
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: 0, textAlign: 'center' }}>
                    검색 결과가 없습니다
                  </p>
                )}
              </div>
            )}
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
