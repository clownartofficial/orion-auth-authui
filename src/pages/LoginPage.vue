<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiGet, apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'
import { performRedirect } from '../composables/useRedirect'
import { useSettings } from '../composables/useSettings'
import AuthSteps from '../components/AuthSteps.vue'
import FlowStepIndicator from '../components/FlowStepIndicator.vue'
import AuthDivider from '../components/AuthDivider.vue'
import AuthAlert from '../components/AuthAlert.vue'
import FederatedButtons from '../components/FederatedButtons.vue'
import { IconChevron, IconArrowLeft, IconEye } from '../components/icons'

const router = useRouter()
const { state, updateFromLoginResponse } = useAuthState()
const { registrationEnabled, federationProviders, fetchSettings } = useSettings()

const step = ref<'email' | 'password'>('email')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  fetchSettings()
  if (state.loginHint) {
    email.value = state.loginHint
  }
})

function goToPassword() {
  if (!email.value) return
  error.value = null
  step.value = 'password'
}

function goBackToEmail() {
  error.value = null
  password.value = ''
  showPassword.value = false
  step.value = 'email'
}

async function handleFederated(providerName: string) {
  loading.value = true
  error.value = null

  const result = await apiGet<{ authorization_url: string }>(
    `/api/v1/auth/federation/${providerName}`
  )

  if (result.ok && result.data.authorization_url) {
    window.location.href = result.data.authorization_url
  } else {
    loading.value = false
    error.value = result.ok ? 'Erreur de redirection.' : result.message
  }
}

async function handleSubmit() {
  error.value = null
  loading.value = true

  const result = await apiPost<{
    redirect_uri?: string
    code?: string
    state?: string
    iss?: string
    session_state?: string
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
      error.value = 'Votre compte est verrouille. Veuillez contacter le support.'
    } else {
      error.value = result.message
    }
    return
  }

  const data = result.data

  if (data.redirect_uri && data.code) {
    performRedirect({
      redirect_uri: data.redirect_uri,
      code: data.code,
      state: data.state,
      iss: data.iss,
      session_state: data.session_state,
    }, state.responseMode)
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
    <!-- Email step -->
    <template v-if="step === 'email'">
      <AuthSteps :current="1" :total="3" />
      <FlowStepIndicator label="connexion" />

      <h1 class="mb-2 font-display text-[32px] font-normal leading-[1.15] tracking-[-0.015em] text-fg-0">
        Bon retour.
      </h1>
      <p class="mb-7 text-[13.5px] leading-[1.55] text-fg-2">
        Entrez votre adresse email pour continuer.
      </p>

      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <form @submit.prevent="goToPassword">
        <div class="mb-3.5 flex flex-col gap-1.5">
          <label class="flex items-center justify-between font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-2">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            class="input"
            placeholder="vous@entreprise.com"
            required
            autofocus
          />
          <span class="font-mono text-[11px] text-fg-3">Nous detecterons le SSO automatiquement pour votre domaine.</span>
        </div>

        <button type="submit" class="auth-btn" :disabled="loading">
          Continuer <IconChevron :size="14" />
        </button>
      </form>

      <template v-if="federationProviders.length > 0">
        <AuthDivider />
        <FederatedButtons :providers="federationProviders" @select="handleFederated" />
      </template>

      <div v-if="registrationEnabled !== false" class="mt-[18px] text-center text-[12.5px] text-fg-2">
        Pas encore de compte ? <RouterLink to="/register" class="font-medium text-accent no-underline hover:underline">Creer un compte</RouterLink>
      </div>
    </template>

    <!-- Password step -->
    <template v-else>
      <AuthSteps :current="1" :total="3" />

      <button
        type="button"
        class="mb-3 flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg-0 cursor-pointer bg-transparent border-none font-[inherit] p-0"
        @click="goBackToEmail"
      >
        <IconArrowLeft :size="13" /> Retour
      </button>

      <FlowStepIndicator label="mot de passe" />

      <h1 class="mb-2 font-display text-[32px] font-normal leading-[1.15] tracking-[-0.015em] text-fg-0">
        Entrez votre mot de passe.
      </h1>
      <p class="mb-7 text-[13.5px] leading-[1.55] text-fg-2">
        Connexion en tant que <strong class="font-medium text-fg-0">{{ email }}</strong>
      </p>

      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3.5 flex flex-col gap-1.5">
          <label class="flex items-center justify-between font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-2">
            <span>Mot de passe</span>
            <RouterLink to="/forgot-password" class="text-[11.5px] normal-case tracking-normal text-accent no-underline hover:underline">
              Oublie ?
            </RouterLink>
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input pr-10"
              placeholder="••••••••••••"
              required
              autofocus
            />
            <button
              type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-fg-3 hover:text-fg-0 p-1"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <IconEye :size="16" :off="showPassword" />
            </button>
          </div>
        </div>

        <button type="submit" class="auth-btn" :disabled="loading">
          {{ loading ? 'Connexion...' : 'Continuer' }}
          <IconChevron v-if="!loading" :size="14" />
        </button>
      </form>
    </template>
  </div>
</template>
