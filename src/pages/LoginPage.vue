<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiGet, apiPost } from '@/composables/useApi'
import { useAuthState } from '@/composables/useAuthState'
import { performRedirect } from '@/composables/useRedirect'
import { useSettings } from '@/composables/useSettings'
import type { FederationProviderInfo } from '@/composables/useSettings'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import { useTheme } from '@/composables/useTheme'
import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'
import { IconMail, IconChevron, IconEye, IconDiscord, IconGitHub, IconSSOEnterprise } from '@/components/icons'

const router = useRouter()
const { state, updateFromLoginResponse } = useAuthState()
const { registrationEnabled, federationProviders, fetchSettings } = useSettings()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const clientName = computed(() => state.clientName || 'OrionAuth')

const { theme } = useTheme()
const logoSrc = computed(() => theme.value === 'dark' ? logoDark : logoLight)

onMounted(() => {
  fetchSettings()
  if (state.loginHint) {
    email.value = state.loginHint
  }
})

const iconMap: Record<string, any> = {
  discord: IconDiscord,
  github: IconGitHub,
}

function getFedIcon(p: FederationProviderInfo) {
  return iconMap[p.name.toLowerCase()] || IconSSOEnterprise
}

async function handleFederated(providerName: string) {
  loading.value = true
  error.value = null
  const result = await apiGet<{ authorization_url: string }>(`/api/v1/auth/federation/${providerName}`)
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
    redirect_uri?: string; code?: string; state?: string; iss?: string; session_state?: string
    request_id?: string; requires_mfa?: boolean; requires_consent?: boolean; scopes?: string[]
  }>('/authorize/login', {
    request_id: state.requestId,
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (!result.ok) {
    if (result.status === 401) error.value = 'Email ou mot de passe incorrect.'
    else if (result.status === 403) error.value = 'Votre compte est verrouille. Veuillez contacter le support.'
    else error.value = result.message
    return
  }

  const data = result.data
  if (data.redirect_uri && data.code) {
    performRedirect({ redirect_uri: data.redirect_uri, code: data.code, state: data.state, iss: data.iss, session_state: data.session_state }, state.responseMode)
    return
  }
  if (data.requires_mfa) { updateFromLoginResponse(data); router.push('/mfa'); return }
  if (data.requires_consent) { updateFromLoginResponse(data); router.push('/consent'); return }
}
</script>

<template>
  <V2Card path="auth.orion.io / <b>signin</b>">
    <!-- Head: orbit logo + title -->
    <div class="v2-card__head">
      <div class="v2-orbit">
        <img :src="logoSrc" alt="OrionAuth" class="h-16 w-16" style="filter: drop-shadow(0 0 18px var(--accent-bg))" />
        <span class="v2-orbit__satellite" />
      </div>
      <h1 class="v2-card__title">Connexion a <em>{{ clientName }}</em></h1>
      <p class="v2-card__sub">Utilisez votre compte pour continuer.</p>
    </div>

    <!-- Body -->
    <div class="v2-card__body">
      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <form @submit.prevent="handleSubmit">
        <div class="v2-field">
          <label class="v2-field__label">Email</label>
          <div class="v2-input-wrap">
            <span class="v2-input-wrap__icon"><IconMail :size="15" /></span>
            <input
              v-model="email"
              type="email"
              placeholder="vous@entreprise.com"
              required
              autofocus
            />
          </div>
        </div>

        <div class="v2-field">
          <label class="v2-field__label flex items-center justify-between">
            <span>Mot de passe</span>
            <RouterLink to="/forgot-password" class="text-[11px] normal-case tracking-normal text-accent no-underline hover:underline">
              Oublie ?
            </RouterLink>
          </label>
          <div class="v2-input-wrap">
            <span class="v2-input-wrap__icon"><IconEye :size="15" /></span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••••••"
              required
            />
            <button
              type="button"
              class="v2-input-wrap__suffix cursor-pointer border-none bg-transparent"
              style="border-left: 1px solid var(--border-subtle)"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              {{ showPassword ? 'masquer' : 'afficher' }}
            </button>
          </div>
        </div>

        <button type="submit" class="v2-cta" :disabled="loading">
          <span class="v2-cta__main">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
            <IconChevron v-if="!loading" :size="14" />
          </span>
          <span class="v2-cta__kbd">&#9166; enter</span>
        </button>
      </form>

      <!-- Federated icon-only row -->
      <div v-if="federationProviders.length > 0" class="v2-fed-row">
        <span class="v2-fed-row__label">ou</span>
        <button
          v-for="p in federationProviders"
          :key="p.name"
          class="v2-fed"
          :aria-label="p.display_name || p.name"
          @click="handleFederated(p.name)"
        >
          <component :is="getFedIcon(p)" :size="16" />
        </button>
      </div>
    </div>

    <!-- Card footer -->
    <div class="v2-card__foot">
      <span v-if="registrationEnabled !== false">
        Pas encore de compte ? <RouterLink to="/register">Creer un compte</RouterLink>
      </span>
      <RouterLink to="/forgot-password">Probleme de connexion ?</RouterLink>
    </div>
  </V2Card>
</template>
