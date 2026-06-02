<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiGet } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'
import { performRedirect } from '../composables/useRedirect'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconSpinner } from '@/components/icons'

const route = useRoute()
const router = useRouter()
const { setFromAuthorizeResponse } = useAuthState()

const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const params: Record<string, string> = {}
  const keys = [
    'client_id', 'redirect_uri', 'response_type', 'scope', 'state',
    'code_challenge', 'code_challenge_method', 'nonce', 'audience',
    'prompt', 'max_age', 'display', 'ui_locales', 'claims_locales',
    'acr_values', 'login_hint', 'claims', 'id_token_hint', 'response_mode',
    'request_uri',
  ]
  for (const key of keys) {
    const value = route.query[key]
    if (typeof value === 'string') {
      params[key] = value
    }
  }

  const hasPAR = !!params.client_id && !!params.request_uri
  const hasStandardParams = !!params.client_id && !!params.redirect_uri && !!params.response_type
  if (!hasPAR && !hasStandardParams) {
    error.value = 'Paramètres OAuth2 manquants.'
    loading.value = false
    return
  }

  const result = await apiGet<{
    request_id: string
    client_name: string
    client_id: string
    scopes_requested: string[]
    requires_login: boolean
    requires_consent: boolean
    login_hint?: string
    display?: string
    prompt?: string
    resource?: {
      name: string
      identifier: string
      permissions: { name: string; description: string | null }[]
    }
    response_mode?: string
    redirect?: {
      redirect_uri: string
      code: string
      state: string
      response_mode?: string
    }
  }>('/authorize', params)

  if (!result.ok) {
    error.value = result.message
    loading.value = false
    return
  }

  // prompt=none: immediate redirect with authorization code
  if (result.data.redirect) {
    performRedirect(result.data.redirect, result.data.redirect.response_mode)
    return
  }

  setFromAuthorizeResponse(result.data)

  // OIDC prompt=create (Initiating User Registration via OIDC 1.0): the
  // client wants the signup UX, not the login form. Route accordingly so the
  // RegisterPage knows to POST to /authorize/register with the request_id.
  if (result.data.prompt === 'create') {
    router.push('/register')
    return
  }

  if (result.data.requires_login) {
    router.push('/login')
  } else if (result.data.requires_consent) {
    router.push('/consent')
  }
})
</script>

<template>
  <div>
    <div class="flex flex-col items-center gap-4 py-8">
      <IconSpinner v-if="loading && !error" :size="32" class="animate-spin text-accent" />
      <Alert v-if="error" variant="destructive">
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>
    </div>
  </div>
</template>
