<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'
import FlowStepIndicator from '../components/FlowStepIndicator.vue'

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
    <button class="btn-back" @click="router.back()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Retour
    </button>

    <FlowStepIndicator label="vérification" :step="2" :total="3" />
    <h1 class="auth-title display">Entrez le code.</h1>
    <p class="auth-sub">Entrez le code à 6 chiffres de votre application d'authentification.</p>

    <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

    <div class="otp-container">
      <InputOtp v-model="code" :length="6" integer-only :disabled="loading" />
    </div>

    <div class="otp-timer">
      code expires in <span class="otp-timer-value">04:59</span>
    </div>

    <div class="auth-foot">
      Vous n'avez pas reçu le code ? <a href="#" @click.prevent="() => {}">Renvoyer</a>
    </div>
  </div>
</template>

<style scoped>
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  margin-bottom: 12px;
  background: transparent;
  border: none;
  color: var(--fg-1);
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  border-radius: var(--r-md);
  transition: all var(--t-fast);
}
.btn-back:hover { background: var(--bg-2); color: var(--fg-0); }

.auth-title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 400;
  letter-spacing: -0.015em;
  color: var(--fg-0);
  margin: 0 0 8px;
  line-height: 1.15;
}
.auth-sub {
  font-size: 13.5px;
  color: var(--fg-2);
  line-height: 1.55;
  margin: 0 0 28px;
}

.otp-container {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.otp-timer {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-3);
  margin-top: 16px;
}
.otp-timer-value { color: var(--fg-0); }

.auth-foot {
  font-size: 12.5px;
  color: var(--fg-2);
  text-align: center;
  margin-top: 24px;
}
.auth-foot a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}
.auth-foot a:hover { text-decoration: underline; }

.msg { margin-bottom: var(--s-2); }
</style>
