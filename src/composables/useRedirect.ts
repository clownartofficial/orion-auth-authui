interface RedirectData {
  redirect_uri: string
  code?: string
  state?: string
  iss?: string
  access_token?: string
  token_type?: string
  expires_in?: number
  id_token?: string
}

export function performRedirect(data: RedirectData, responseMode?: string | null) {
  const mode = responseMode || 'query'
  const params: Record<string, string> = {}
  if (data.code) params.code = data.code
  if (data.state) params.state = data.state
  if (data.iss) params.iss = data.iss
  if (data.access_token) params.access_token = data.access_token
  if (data.token_type) params.token_type = data.token_type
  if (data.expires_in) params.expires_in = String(data.expires_in)
  if (data.id_token) params.id_token = data.id_token

  if (mode === 'fragment') {
    const fragment = new URLSearchParams(params).toString()
    window.location.href = `${data.redirect_uri}#${fragment}`
  } else if (mode === 'form_post') {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = data.redirect_uri
    for (const [key, val] of Object.entries(params)) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = val
      form.appendChild(input)
    }
    document.body.appendChild(form)
    form.submit()
  } else {
    const url = new URL(data.redirect_uri)
    for (const [key, val] of Object.entries(params)) {
      url.searchParams.set(key, val)
    }
    window.location.href = url.toString()
  }
}
