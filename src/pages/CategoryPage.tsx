import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, type StartupItem } from '../api'
import ItemCard from '../components/ItemCard'
import ItemModal from '../components/ItemModal'

type Category = 'web' | 'app' | 'exe'

const CATEGORY_META: Record<Category, {
  label: string
  icon: string
  color: string
  desc: string
  types: StartupItem['type'][]
  defaultType: StartupItem['type']
}> = {
  web: {
    label: '웹',
    icon: '🌐',
    color: '#4D96FF',
    desc: '부팅 시 자동으로 열 웹 URL을 관리합니다',
    types: ['browser_url'],
    defaultType: 'browser_url',
  },
  app: {
    label: '앱',
    icon: '📱',
    color: '#FF9A3C',
    desc: '자동 실행할 앱을 관리합니다',
    types: ['app'],
    defaultType: 'app',
  },
  exe: {
    label: '실행파일',
    icon: '📂',
    color: '#6BCB77',
    desc: '자동 실행할 EXE 파일을 관리합니다',
    types: ['exe', 'uploaded_exe'],
    defaultType: 'exe',
  },
}

interface Props {
  category: Category
}

export default function CategoryPage({ category }: Props) {
  const meta = CATEGORY_META[category]
  const [modal, setModal] = useState<{ open: boolean; item?: StartupItem }>({ open: false })

  const { data: allItems = [], isLoading, isError } = useQuery({
    queryKey: ['items'],
    queryFn: api.items.list,
    refetchInterval: 5000,
  })

  const items = allItems.filter(i => (meta.types as string[]).includes(i.type))
  const enabled = items.filter(i => i.enabled)
  const disabled = items.filter(i => !i.enabled)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, height: '100%', overflowY: 'auto' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: meta.color + '18',
            border: `1.5px solid ${meta.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            {meta.icon}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1E293B' }}>
              {meta.label}
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#64748B', marginTop: 2 }}>
              {meta.desc}
            </p>
          </div>
        </div>
        <button
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: 13 }}
          onClick={() => setModal({ open: true })}
        >
          + {meta.label} 추가
        </button>
      </div>

      {/* 로딩 / 에러 */}
      {isLoading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#94A3B8' }}>불러오는 중…</p>
        </div>
      )}
      {isError && (
        <div className="glass-sm" style={{ padding: 16, fontSize: 13, color: '#DC2626' }}>
          ⚠️ API 서버에 연결할 수 없습니다.
        </div>
      )}

      {/* 활성 */}
      {!isLoading && !isError && enabled.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{
            margin: 0, fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8',
          }}>
            활성 ({enabled.length})
          </h2>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {enabled.map(item => (
              <ItemCard key={item.id} item={item} onEdit={i => setModal({ open: true, item: i })} />
            ))}
          </div>
        </section>
      )}

      {/* 비활성 */}
      {!isLoading && !isError && disabled.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{
            margin: 0, fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8',
          }}>
            비활성 ({disabled.length})
          </h2>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {disabled.map(item => (
              <ItemCard key={item.id} item={item} onEdit={i => setModal({ open: true, item: i })} />
            ))}
          </div>
        </section>
      )}

      {/* 빈 상태 */}
      {!isLoading && !isError && items.length === 0 && (
        <div className="glass" style={{
          flex: 1, minHeight: 200,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <span style={{ fontSize: 44 }}>{meta.icon}</span>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
            아직 {meta.label} 항목이 없어요.
          </p>
          <button
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: 13 }}
            onClick={() => setModal({ open: true })}
          >
            + 첫 항목 추가
          </button>
        </div>
      )}

      {/* 모달 */}
      {modal.open && (
        <ItemModal
          item={modal.item}
          defaultType={meta.defaultType}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  )
}
