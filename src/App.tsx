import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OrbBackground from './components/OrbBackground'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Settings from './pages/Settings'

const qc = new QueryClient()

function AppShell() {
  const [page, setPage] = useState('home')

  return (
    <div className="relative flex w-full h-full overflow-hidden">
      <OrbBackground />
      <Sidebar current={page} onChange={setPage} />
      <main className="flex-1 z-10 overflow-hidden">
        {page === 'home'     && <Home />}
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
