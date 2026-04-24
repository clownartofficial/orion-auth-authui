import { reactive, readonly } from 'vue'

export interface ResourceInfo {
  name: string
  identifier: string
  permissions: { name: string; description: string | null }[]
}

export interface AuthState {
  requestId: string | null
  clientName: string | null
  clientId: string | null
  requestedScopes: string[]
  requiresLogin: boolean
  requiresConsent: boolean
  resource: ResourceInfo | null
  loginHint: string | null
  display: string | null
  prompt: string | null
  responseMode: string | null
}

const state = reactive<AuthState>({
  requestId: null,
  clientName: null,
  clientId: null,
  requestedScopes: [],
  requiresLogin: false,
  requiresConsent: false,
  resource: null,
  loginHint: null,
  display: null,
  prompt: null,
  responseMode: null,
})

export function useAuthState() {
  function setFromAuthorizeResponse(data: {
    request_id: string
    client_name: string
    client_id: string
    scopes_requested: string[]
    requires_login: boolean
    requires_consent: boolean
    resource?: ResourceInfo
    login_hint?: string
    display?: string
    prompt?: string
    response_mode?: string
  }) {
    state.requestId = data.request_id
    state.clientName = data.client_name
    state.clientId = data.client_id
    state.requestedScopes = data.scopes_requested
    state.requiresLogin = data.requires_login
    state.requiresConsent = data.requires_consent
    state.resource = data.resource ?? null
    state.loginHint = data.login_hint ?? null
    state.display = data.display ?? null
    state.prompt = data.prompt ?? null
    state.responseMode = data.response_mode ?? null
  }

  function updateFromLoginResponse(data: {
    request_id?: string
    requires_consent?: boolean
    scopes?: string[]
  }) {
    if (data.request_id) state.requestId = data.request_id
    if (data.requires_consent !== undefined) state.requiresConsent = data.requires_consent
    if (data.scopes) state.requestedScopes = data.scopes
  }

  function clear() {
    state.requestId = null
    state.clientName = null
    state.clientId = null
    state.requestedScopes = []
    state.requiresLogin = false
    state.requiresConsent = false
    state.resource = null
    state.loginHint = null
    state.display = null
    state.prompt = null
    state.responseMode = null
  }

  return {
    state: readonly(state),
    setFromAuthorizeResponse,
    updateFromLoginResponse,
    clear,
  }
}
