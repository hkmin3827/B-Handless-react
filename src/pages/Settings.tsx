import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'

export default function Settings() {
  const qc = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: api.settings.get,
  })

  const mut = useMutation({
    mutationFn: (body: Parameters<typeof api.settings.update>[0]) => api.settings.update(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center flex-1 p-6">
        <p style={{ color: 'rgba(245,245,245,0.4)' }}>불러오는 중…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-lg">
      <div>
        <h1 className="text-xl font-bold m-0" style={{ color: '#F5F5F5' }}>설정</h1>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(245,245,245,0.45)' }}>
          서버 포트 및 동작 설정을 변경합니다
        </p>
      </div>

      {/* 설정 카드들 */}
      {[
        { key: 'api_port',       label: 'API 포트',       type: 'number', desc: 'FastAPI 서버 포트 (기본 8000)' },
        { key: 'dashboard_port', label: '대시보드 포트',  type: 'number', desc: '이 화면의 포트 (기본 3000)' },
      ].map(({ key, label, type, desc }) => (
        <div key={key} className="glass p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold m-0" style={{ color: '#F5F5F5' }}>{label}</p>
              <p className="text-xs m-0" style={{ color: 'rgba(245,245,245,0.45)' }}>{desc}</p>
            </div>
            <input
              className="input-glass text-right"
              style={{ width: 100 }}
              type={type}
              defaultValue={(settings as unknown as Record<string, number>)[key]}
              onBlur={e => {
                const val = Number(e.target.value)
                if (val > 0) mut.mutate({ [key]: val })
              }}
            />
          </div>
        </div>
      ))}

      {/* 로그 활성화 토글 */}
      <div className="glass p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold m-0" style={{ color: '#F5F5F5' }}>로그 기록</p>
          <p className="text-xs m-0" style={{ color: 'rgba(245,245,245,0.45)' }}>
            실행 로그를 logs/startup.log에 기록
          </p>
        </div>
        <button
          className={`toggle-track ${settings.log_enabled ? 'on' : 'off'}`}
          onClick={() => mut.mutate({ log_enabled: !settings.log_enabled })}
        >
          <div className="toggle-thumb" />
        </button>
      </div>

      {/* 시작 프로그램 등록 상태 (읽기 전용 표시) */}
      <div className="glass-sm p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold m-0" style={{ color: '#F5F5F5' }}>Windows 시작 등록</p>
          <p className="text-xs m-0" style={{ color: 'rgba(245,245,245,0.45)' }}>
            python main.py --register 명령으로 변경
          </p>
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={settings.registered_as_startup
            ? { background: 'rgba(107,203,119,0.2)', color: '#6BCB77' }
            : { background: 'rgba(255,255,255,0.08)', color: 'rgba(245,245,245,0.4)' }
          }
        >
          {settings.registered_as_startup ? '✅ 등록됨' : '미등록'}
        </span>
      </div>
    </div>
  )
}
