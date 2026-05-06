import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, type StartupItem } from '../api'
import ItemCard from '../components/ItemCard'
import ItemModal from '../components/ItemModal'
import HeroGraphic from '../components/HeroGraphic'

type Page = 'home' | 'web' | 'app' | 'exe' | 'settings'

interface Props {
  onNavigate: (page: Page) => void
}

const CATEGORIES = [
  {
    id: 'web' as Page,
    label: '웹',
    icon: '🌐',
    color: '#4D96FF',
    pastel: '#EEF4FF',
    types: ['browser_url'] as StartupItem['type'][],
    defaultType: 'browser_url' as StartupItem['type'],
  },
  {
    id: 'app' as Page,
    label: '앱',
    icon: '📱',
    color: '#f9823dff',
    pastel: '#FFF4EB',
    types: ['app'] as StartupItem['type'][],
    defaultType: 'app' as StartupItem['type'],
  },
  {
    id: 'exe' as Page,
    label: '실행파일',
    icon: '📂',
    color: '#3f9c4cff',
    pastel: '#EEFBF0',
    types: ['exe', 'uploaded_exe'] as StartupItem['type'][],
    defaultType: 'exe' as StartupItem['type'],
  },
]

const PREVIEW_COUNT = 2

export default function Home({ onNavigate }: Props) {
  const [modal, setModal] = useState<{
    open: boolean
    item?: StartupItem
    defaultType?: StartupItem['type']
  }>({ open: false })

  const [wide, setWide] = useState(window.innerWidth > 1000)
  useEffect(() => {
    const handler = () => setWide(window.innerWidth > 1000)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['items'],
    queryFn: api.items.list,
    refetchInterval: 5000,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24, height: '100%', overflowY: 'auto' }}>
      {/* 헤더 */}
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1E293B' }}>홈</h1>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748B' }}>
          카테고리별 시작 항목을 한눈에 확인합니다
        </p>
      </div>

      {/* 에러 */}
      {isError && (
        <div className="glass-sm" style={{ padding: 14, fontSize: 13, color: '#DC2626' }}>
          ⚠️ API 서버에 연결할 수 없습니다. <code>python main.py --serve</code>가 실행 중인지 확인해 주세요.
        </div>
      )}

      {/* 메인 2단 레이아웃 */}
      <div style={{ display: 'grid', gridTemplateColumns: wide ? '1fr 420px' : '1fr', gap: 20, flex: 1, minHeight: 0 }}>

        {/* 좌측: 카테고리별 미리보기 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          {CATEGORIES.map(cat => {
            const catItems = items.filter(i => (cat.types as string[]).includes(i.type))
            const preview = catItems.slice(0, PREVIEW_COUNT)
            const hasMore = catItems.length > PREVIEW_COUNT

            return (
              <section key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* 섹션 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: cat.pastel,
                      border: `1.5px solid ${cat.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15,
                    }}>
                      {cat.icon}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>
                      {cat.label}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      padding: '1px 7px', borderRadius: 20,
                      background: cat.color + '18',
                      color: cat.color,
                    }}>
                      {catItems.length}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate(cat.id)}
                    style={{
                      fontSize: 12, color: cat.color, fontWeight: 600,
                      background: 'none', border: 'none', cursor: 'pointer',
                      padding: '4px 8px', borderRadius: 6,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = cat.color + '12')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    더보기 →
                  </button>
                </div>

                {/* 미리보기 카드 */}
                {isLoading ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                    불러오는 중…
                  </div>
                ) : preview.length > 0 ? (
                  <>
                    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                      {preview.map(item => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          onEdit={i => setModal({ open: true, item: i })}
                        />
                      ))}
                    </div>
                    {hasMore && (
                      <button
                        onClick={() => onNavigate(cat.id)}
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: 12, color: '#64748B',
                          background: 'none', border: '1px dashed #CBD5E1',
                          borderRadius: 8, cursor: 'pointer',
                          padding: '6px 14px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = cat.color
                          e.currentTarget.style.color = cat.color
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#CBD5E1'
                          e.currentTarget.style.color = '#64748B'
                        }}
                      >
                        +{catItems.length - PREVIEW_COUNT}개 더 보기
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{
                    padding: '14px 16px', borderRadius: 12,
                    background: cat.pastel,
                    border: `1px dashed ${cat.color}30`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <span style={{ fontSize: 12, color: '#4f535aff' }}>
                      아직 {cat.label} 항목이 없어요.
                    </span>
                    <button
                      onClick={() => setModal({ open: true, defaultType: cat.defaultType })}
                      style={{
                        marginLeft: 'auto', fontSize: 12, fontWeight: 600,
                        color: cat.color, background: 'none',
                        border: `1px solid ${cat.color}40`, borderRadius: 6,
                        cursor: 'pointer', padding: '4px 10px',
                      }}
                    >
                      + 추가
                    </button>
                  </div>
                )}
              </section>
            )
          })}
        </div>

        {wide && (
          <div style={{
            position: 'sticky', top: 0,
            height: 'fit-content',
            background: 'linear-gradient(135deg, #EEF4FF 0%, #F5EEFF 100%)',
            borderRadius: 20,
            border: '1px solid rgba(111,159,242,0.15)',
            overflow: 'hidden',
            padding: '8px 0',
            boxShadow: '0 4px 20px rgba(111,159,242,0.10)',
          }}>
            <HeroGraphic />
          </div>
        )}
      </div>

      {/* 모달 */}
      {modal.open && (
        <ItemModal
          item={modal.item}
          defaultType={modal.defaultType}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}
