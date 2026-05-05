import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OrbBackground from './components/OrbBackground'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Settings from './pages/Settings'
import CategoryPage from './pages/CategoryPage'

const qc = new QueryClient()

type Page = 'home' | 'web' | 'app' | 'exe' | 'settings'

function AppShell() {
  const [page, setPage] = useState<Page>('home')

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
