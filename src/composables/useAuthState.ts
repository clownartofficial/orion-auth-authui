import { reactive, readonly } from 'vue'

export interface AuthState {
  requestId: string | null
  clientName: string | null
  clientId: string | null
  requestedScopes: string[]
  requiresLogin: boolean
  requiresConsent: boolean
}

const state = reactive<AuthState>({
  requestId: null,
  clientName: null,
  clientId: null,
  requestedScopes: [],
  requiresLogin: false,
  requiresConsent: false,
})

export function useAuthState() {
  function setFromAuthorizeResponse(data: {
    request_id: string
    client_name: string
    client_id: string
    scopes_requested: string[]
    requires_login: boolean
    requires_consent: boolean
  }) {
    state.requestId = data.request_id
    state.clientName = data.client_name
    state.clientId = data.client_id
    state.requestedScopes = data.scopes_requested
    state.requiresLogin = data.requires_login
    state.requiresConsent = data.requires_consent
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
  }

  return {
    state: readonly(state),
    setFromAuthorizeResponse,
    updateFromLoginResponse,
    clear,
  }
}
