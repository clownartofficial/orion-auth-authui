export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string }

function getIssuerUrl(): string {
  return import.meta.env.VITE_ORION_ISSUER || ''
}

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<ApiResult<T>> {
  try {
    const base = path.startsWith('/authorize') ? getIssuerUrl() : ''
    const url = new URL(`${base}${path}`, window.location.origin)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value)
      }
    }
    const response = await fetch(url.toString())
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      return { ok: false, status: response.status, message: body.error || body.message || response.statusText }
    }
    const data = await response.json()
    return { ok: true, data }
  } catch {
    return { ok: false, status: 0, message: 'Erreur réseau. Veuillez réessayer.' }
  }
}

export async function apiPost<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const base = path.startsWith('/authorize') ? getIssuerUrl() : ''
    const url = `${base}${path}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return { ok: false, status: response.status, message: data.error || data.message || response.statusText }
    }
    const data = await response.json()
    return { ok: true, data }
  } catch {
    return { ok: false, status: 0, message: 'Erreur réseau. Veuillez réessayer.' }
  }
}
