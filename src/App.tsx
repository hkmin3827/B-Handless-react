import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OrbBackground from './components/OrbBackground'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Settings from './pages/Settings'
import CategoryPage from './pages/CategoryPage'

const qc = new QueryClient()

type Page = 'home' | 'web' | 'app' | 'exe' | 'settings'

function ServerOfflineBanner({ onConnected }: { onConnected: () => void }) {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    setRetrying(true)
    const deadline = Date.now() + 15000
    while (Date.now() < deadline) {
      try {
        const res = await fetch('/api/items', {
          signal: AbortSignal.timeout(2000),
          cache: 'no-store',
        })
        if (res.ok) {
          onConnected()
          return
        }
      } catch {}
      await new Promise(r => setTimeout(r, 1000))
    }
    setRetrying(false)
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/10 border border-white/20 rounded-2xl p-8 max-w-sm w-full mx-4 text-center space-y-5">
        <div className="text-4xl">🔌</div>
        <div>
          <p className="text-white font-semibold text-lg">서버가 꺼져 있어요</p>
          <p className="text-white/60 text-sm mt-1">
            B-Handless 서버가 실행 중이 아닙니다
          </p>
        </div>
        <div className="space-y-3">
          <a
            href="bhandless://"
            className="block w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
          >
            🚀 B-Handless 서버 시작하기
          </a>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="block w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors disabled:opacity-50"
          >
            {retrying ? '확인 중...' : '🔄 재연결 시도'}
          </button>
        </div>
        <p className="text-white/40 text-xs">
          서버 시작 후 재연결 버튼을 눌러주세요
        </p>
      </div>
    </div>
  )
}

function AppShell() {
  const [page, setPage] = useState<Page>('home')
  const [serverOnline, setServerOnline] = useState<boolean | null>(null)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/items', { signal: AbortSignal.timeout(2000) })
        setServerOnline(res.ok)
      } catch {
        setServerOnline(false)
      }
    }
    check()
  }, [])

  return (
    <div className="relative flex w-full h-full overflow-hidden">
      <OrbBackground />
      <Sidebar current={page} onChange={id => setPage(id as Page)} />
      <main className="flex-1 z-10 overflow-hidden">
        {page === 'home'     && <Home onNavigate={setPage} />}
        {page === 'web'      && <CategoryPage category="web" />}
        {page === 'app'      && <CategoryPage category="app" />}
        {page === 'exe'      && <CategoryPage category="exe" />}
        {page === 'settings' && <Settings />}
      </main>
      {serverOnline === false && <ServerOfflineBanner onConnected={() => setServerOnline(true)} />}
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AppShell />
    </QueryClientProvider>
  )
}
