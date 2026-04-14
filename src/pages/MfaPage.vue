<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'

const router = useRouter()
const { state, updateFromLoginResponse } = useAuthState()

const code = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

watch(code, (val) => {
  if (val.length === 6) {
    handleSubmit()
  }
})

async function handleSubmit() {
  error.value = null
  loading.value = true

  const result = await apiPost<{
    redirect_uri?: string
    code?: string
    state?: string
    requires_consent?: boolean
    scopes?: string[]
  }>('/authorize/mfa', {
    request_id: state.requestId,
    code: code.value,
  })

  loading.value = false

  if (!result.ok) {
    if (result.status === 403) {
      error.value = 'Code invalide. Veuillez réessayer.'
    } else {
      error.value = result.message
    }
    code.value = ''
    return
  }

  const data = result.data

  if (data.redirect_uri && data.code) {
    const url = new URL(data.redirect_uri)
    url.searchParams.set('code', data.code)
    if (data.state) url.searchParams.set('state', data.state)
    window.location.href = url.toString()
    return
  }

  if (data.requires_consent) {
    updateFromLoginResponse(data)
    router.push('/consent')
  }
}
</script>

<template>
  <div class="page">
    <h2 class="page-title">Vérification MFA</h2>
    <p class="page-sub">$ auth --verify-totp</p>
    <p class="page-desc">Entrez le code à 6 chiffres de votre application d'authentification.</p>

    <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

    <div class="otp-container">
      <InputOtp v-model="code" :length="6" integer-only :disabled="loading" />
    </div>

    <Button
      label="Vérifier"
      :loading="loading"
      :disabled="code.length !== 6"
      @click="handleSubmit"
      fluid
    />
  </div>
</template>

<style scoped>
.page-title {
  text-align: center;
  font-family: var(--nh-sans);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-bottom: 2px;
}

.page-sub {
  text-align: center;
  font-family: var(--nh-mono);
  font-size: 11px;
  color: var(--nh-muted);
  margin-bottom: 0.5rem;
}

.page-desc {
  text-align: center;
  font-size: 13px;
  color: var(--nh-muted);
  margin-bottom: 1.5rem;
}

.otp-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.msg {
  margin-bottom: 0.5rem;
}
</style>
