export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string }

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<ApiResult<T>> {
  try {
    const url = new URL(path, window.location.origin)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value)
      }
    }
    const response = await fetch(url.toString())
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      return { ok: false, status: response.status, message: extractErrorMessage(body) || response.statusText }
    }
    const data = await response.json()
    return { ok: true, data }
  } catch {
    return { ok: false, status: 0, message: 'Erreur réseau. Veuillez réessayer.' }
  }
}

export async function apiPost<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      return { ok: false, status: response.status, message: extractErrorMessage(body) || response.statusText }
    }
    const data = await response.json()
    return { ok: true, data }
  } catch {
    return { ok: false, status: 0, message: 'Erreur réseau. Veuillez réessayer.' }
  }
}

// extractErrorMessage normalizes the error message across the two response
// shapes the backend uses:
//   OAuth2 errors → { error: "access_denied", error_description: "..." }
//   App errors    → { error: { code: "...", message: "..." } }
// Plain { message: "..." } and stringy errors fall through.
function extractErrorMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Record<string, unknown>
  if (typeof b.error_description === 'string' && b.error_description) {
    return b.error_description
  }
  if (b.error && typeof b.error === 'object') {
    const err = b.error as { message?: unknown; code?: unknown }
    if (typeof err.message === 'string' && err.message) return err.message
    if (typeof err.code === 'string' && err.code) return err.code
  }
  if (typeof b.error === 'string' && b.error) return b.error
  if (typeof b.message === 'string' && b.message) return b.message
  return null
}
