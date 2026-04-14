<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiGet } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'

const route = useRoute()
const router = useRouter()
const { setFromAuthorizeResponse } = useAuthState()

const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const params: Record<string, string> = {}
  const keys = ['client_id', 'redirect_uri', 'response_type', 'scope', 'state', 'code_challenge', 'code_challenge_method']
  for (const key of keys) {
    const value = route.query[key]
    if (typeof value === 'string') {
      params[key] = value
    }
  }

  if (!params.client_id || !params.redirect_uri || !params.response_type) {
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
  }>('/authorize', params)

  if (!result.ok) {
    error.value = result.message
    loading.value = false
    return
  }

  setFromAuthorizeResponse(result.data)

  if (result.data.requires_login) {
    router.push('/login')
  } else if (result.data.requires_consent) {
    router.push('/consent')
  }
})
</script>

<template>
  <div class="page">
    <div class="content">
      <ProgressSpinner v-if="loading && !error" />
      <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}
</style>
