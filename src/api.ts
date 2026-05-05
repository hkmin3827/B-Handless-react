const BASE = '/api'

export interface StartupItem {
  id: string
  type: 'browser_url' | 'exe' | 'app' | 'uploaded_exe'
  label: string
  enabled: boolean
  delay_seconds: number
  url?: string
  browser?: string
  path?: string
  args?: string[]
}

export interface AppSettings {
  api_port: number
  dashboard_port: number
  log_enabled: boolean
  registered_as_startup: boolean
}

export interface Browser {
  id: string
  label: string
  installed: boolean
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 204) return undefined as T
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? '요청 실패')
  }
  return res.json()
}

export const api = {
  items: {
    list: ()                              => request<StartupItem[]>('GET',    '/items'),
    get:  (id: string)                    => request<StartupItem> ('GET',    `/items/${id}`),
    add:  (body: Omit<StartupItem,'id'>) => request<StartupItem> ('POST',   '/items', body),
    update:(id: string, body: Partial<StartupItem>) => request<StartupItem>('PATCH', `/items/${id}`, body),
    delete:(id: string)                   => request<void>        ('DELETE', `/items/${id}`),
    toggle:(id: string)                   => request<StartupItem> ('POST',   `/items/${id}/toggle`),
    run:   (id: string)                   => request<{ok:boolean}>('POST',   `/items/${id}/run`),
  },
  settings: {
    get:    ()                  => request<AppSettings>('GET',   '/settings'),
    update: (body: Partial<AppSettings>) => request<AppSettings>('PATCH', '/settings', body),
  },
  browsers: {
    list: () => request<Browser[]>('GET', '/browsers'),
  },
}
