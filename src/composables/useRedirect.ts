interface RedirectData {
  redirect_uri: string
  code?: string
  state?: string
}

export function performRedirect(data: RedirectData, responseMode?: string | null) {
  const mode = responseMode || 'query'
  const params: Record<string, string> = {}
  if (data.code) params.code = data.code
  if (data.state) params.state = data.state

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
