import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, type StartupItem } from '../api'
import ItemCard from '../components/ItemCard'
import ItemModal from '../components/ItemModal'

export default function Home() {
  const [modal, setModal] = useState<{ open: boolean; item?: StartupItem }>({ open: false })

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['items'],
    queryFn: api.items.list,
    refetchInterval: 5000,
  })

  const enabled  = items.filter(i => i.enabled)
  const disabled = items.filter(i => !i.enabled)

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold m-0" style={{ color: '#F5F5F5' }}>시작 항목</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(245,245,245,0.45)' }}>
            부팅 시 자동으로 실행할 항목을 관리합니다
          </p>
        </div>
        <button
          className="btn-primary px-4 py-2 text-sm"
          onClick={() => setModal({ open: true })}
        >
          + 항목 추가
        </button>
      </div>

      {/* 로딩 / 에러 */}
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <p style={{ color: 'rgba(245,245,245,0.4)' }}>불러오는 중…</p>
        </div>
      )}
      {isError && (
        <div className="glass-sm p-4 text-sm" style={{ color: '#FF6B6B' }}>
          ⚠️ API 서버에 연결할 수 없습니다. <code>python main.py --serve</code>가 실행 중인지 확인해 주세요.
        </div>
      )}

      {/* 활성 항목 */}
      {!isLoading && !isError && (
        <>
          {enabled.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider m-0"
                style={{ color: 'rgba(245,245,245,0.4)' }}>
                활성 ({enabled.length})
              </h2>
              <div className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                {enabled.map(item => (
                  <ItemCard key={item.id} item={item} onEdit={i => setModal({ open: true, item: i })} />
                ))}
              </div>
            </section>
          )}

          {/* 비활성 항목 */}
          {disabled.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider m-0"
                style={{ color: 'rgba(245,245,245,0.4)' }}>
                비활성 ({disabled.length})
              </h2>
              <div className="grid gap-4"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                {disabled.map(item => (
                  <ItemCard key={item.id} item={item} onEdit={i => setModal({ open: true, item: i })} />
                ))}
              </div>
            </section>
          )}

          {/* 빈 상태 */}
          {items.length === 0 && (
            <div className="glass flex flex-col items-center justify-center gap-4 flex-1 min-h-48">
              <span style={{ fontSize: 48 }}>🚀</span>
              <p className="text-sm" style={{ color: 'rgba(245,245,245,0.5)' }}>
                아직 항목이 없어요. 위의 버튼으로 추가해 보세요!
              </p>
            </div>
          )}
        </>
      )}

      {/* 모달 */}
      {modal.open && (
        <ItemModal
          item={modal.item}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}
