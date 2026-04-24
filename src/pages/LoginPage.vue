<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'
import { performRedirect } from '../composables/useRedirect'
import { useSettings } from '../composables/useSettings'
import FlowStepIndicator from '../components/FlowStepIndicator.vue'
// import AuthDivider from '../components/AuthDivider.vue'
// import FederatedButtons from '../components/FederatedButtons.vue'

const router = useRouter()
const { state, updateFromLoginResponse } = useAuthState()
const { registrationEnabled, fetchSettings } = useSettings()

onMounted(() => {
  fetchSettings()
  if (state.loginHint) {
    email.value = state.loginHint
  }
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  error.value = null
  loading.value = true

  const result = await apiPost<{
    redirect_uri?: string
    code?: string
    state?: string
    request_id?: string
    requires_mfa?: boolean
    requires_consent?: boolean
    authenticated?: boolean
    scopes?: string[]
  }>('/authorize/login', {
    request_id: state.requestId,
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (!result.ok) {
    if (result.status === 401) {
      error.value = 'Email ou mot de passe incorrect.'
    } else if (result.status === 403) {
      error.value = 'Votre compte est verrouillé. Veuillez contacter le support.'
    } else {
      error.value = result.message
    }
    return
  }

  const data = result.data

  if (data.redirect_uri && data.code) {
    performRedirect(data, state.responseMode)
    return
  }

  if (data.requires_mfa) {
    updateFromLoginResponse(data)
    router.push('/mfa')
    return
  }

  if (data.requires_consent) {
    updateFromLoginResponse(data)
    router.push('/consent')
    return
  }
}
</script>

<template>
  <div>
    <FlowStepIndicator label="sign in" :step="1" :total="3" />
    <h1 class="font-display text-[32px] font-normal leading-[1.15] tracking-[-0.015em] text-fg-0 mb-2">Welcome back.</h1>
    <p class="text-[13.5px] leading-[1.55] text-fg-2 mb-7">Entrez votre email pour continuer. Nous détecterons votre provider automatiquement.</p>

    <Message v-if="error" severity="error" :closable="false" class="mb-2">{{ error }}</Message>

    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-1.5 mb-3.5">
        <label class="flex items-center justify-between font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-2">Email</label>
        <InputText
          v-model="email"
          type="email"
          placeholder="vous@entreprise.com"
          required
          fluid
        />
        <div class="font-mono text-[11px] text-fg-3">Détection SSO automatique pour votre domaine.</div>
      </div>

      <div class="flex flex-col gap-1.5 mb-3.5">
        <div class="flex items-center justify-between font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-2">
          <span>Mot de passe</span>
          <RouterLink to="/forgot-password" class="text-accent no-underline normal-case tracking-normal text-[11.5px] hover:underline">Oublié ?</RouterLink>
        </div>
        <Password
          v-model="password"
          :feedback="false"
          toggle-mask
          required
          fluid
        />
      </div>

      <button type="submit" class="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-md border-none bg-accent px-3.5 py-3 font-[inherit] text-sm font-semibold text-fg-0 cursor-pointer transition-all duration-fast hover:-translate-y-px hover:bg-accent-hi hover:shadow-[0_8px_20px_-8px_var(--accent)] disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Continuer' }}
        <svg v-if="!loading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </form>

    <!-- TODO: Passkey sign-in (needs WebAuthn backend support)
    <button class="mt-2.5 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-bg-1 px-3 py-2.5 font-[inherit] text-[13px] font-medium text-fg-0 cursor-pointer transition-all duration-fast hover:-translate-y-px hover:border-border-strong hover:bg-bg-2" type="button">
      Se connecter avec un passkey
    </button>
    -->

    <!-- TODO: Federated login (needs federation backend)
    <AuthDivider text="ou continuer avec" />
    <FederatedButtons />
    -->

    <div class="mt-[18px] text-center text-[12.5px] text-fg-2" v-if="registrationEnabled !== false">
      Pas encore de compte ? <RouterLink to="/register" class="text-accent no-underline font-medium hover:underline">Créer un compte</RouterLink>
    </div>
  </div>
</template>
