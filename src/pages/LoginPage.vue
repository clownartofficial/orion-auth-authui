<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiPost } from '@/composables/useApi'
import { useAuthState } from '@/composables/useAuthState'
import { performRedirect } from '@/composables/useRedirect'
import { useSettings } from '@/composables/useSettings'
import type { FederationProviderInfo } from '@/composables/useSettings'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import ClownLogo from '@/components/icons/ClownLogo.vue'
import { IconMail, IconChevron, IconEye, IconDiscord, IconGitHub, IconSSOEnterprise } from '@/components/icons'

const router = useRouter()
const route = useRoute()
const { state, updateFromLoginResponse } = useAuthState()
const { registrationEnabled, federationProviders, fetchSettings } = useSettings()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const needsEmailVerification = ref(false)
const resendingVerification = ref(false)
const verificationResent = ref(false)

const clientName = computed(() => state.clientName || 'OrionAuth')

const federationErrors: Record<string, string> = {
  account_exists_link_required:
    'Un compte existe deja avec cet email. Connectez-vous en local puis liez le fournisseur depuis votre profil.',
  registration_disabled:
    "L'inscription publique est desactivee. Demandez une invitation a un administrateur.",
  callback_failed: "La connexion via le fournisseur externe a echoue.",
  authorize_resume_failed: 'Impossible de reprendre la demande d\u2019autorisation.',
  authorize_complete_failed: 'Impossible de finaliser la demande d\u2019autorisation.',
  provisioning_failed: "La creation du compte via le fournisseur externe a echoue.",
}

onMounted(() => {
  fetchSettings()
  if (state.loginHint) {
    email.value = state.loginHint
  }
  const code = (route.query.error as string) || ''
  if (code) {
    error.value = federationErrors[code] || `Erreur federation: ${code}`
  }
})

const iconMap: Record<string, any> = {
  discord: IconDiscord,
  github: IconGitHub,
}

function getFedIcon(p: FederationProviderInfo) {
  return iconMap[p.name.toLowerCase()] || IconSSOEnterprise
}

function handleFederated(providerName: string) {
  loading.value = true
  error.value = null
  // The backend answers /api/v1/auth/federation/:provider with a 302 redirect
  // to the external provider, so a same-origin XHR cannot follow it. Doing a
  // full-page navigation lets the browser handle the cross-origin redirect.
  const params = new URLSearchParams()
  if (state.requestId) params.set('oauth_request_id', state.requestId)
  const qs = params.toString()
  const url = `/api/v1/auth/federation/${encodeURIComponent(providerName)}${qs ? `?${qs}` : ''}`
  window.location.href = url
}

async function resendVerification() {
  if (!email.value || resendingVerification.value) return
  resendingVerification.value = true
  await apiPost('/api/v1/auth/resend-verification', {
    email: email.value,
    oauth_request_id: state.requestId || undefined,
  })
  resendingVerification.value = false
  verificationResent.value = true
}

async function handleSubmit() {
  error.value = null
  needsEmailVerification.value = false
  verificationResent.value = false
  loading.value = true

  const result = await apiPost<{
    redirect_uri?: string; code?: string; state?: string; iss?: string; session_state?: string
    request_id?: string; requires_mfa?: boolean; requires_consent?: boolean; scopes?: string[]
  }>('/authorize/login', {
    request_id: state.requestId,
    email: email.value,
    password: password.value,
    remember_me: rememberMe.value,
  })

  loading.value = false

  if (!result.ok) {
    // Email-not-verified is a recoverable state: render a banner with a
    // resend button rather than the generic error message.
    if (result.code === 'email_not_verified') {
      needsEmailVerification.value = true
      return
    }
    // Prefer the server-side message (OAuth error_description, AppError message,
    // etc.) — it conveys policy denial reasons, lockout details, etc. Fall back
    // to a generic localized hint only when the server gave us nothing useful.
    if (result.message && result.message !== result.status.toString()) {
      error.value = result.message
    } else if (result.status === 401) {
      error.value = 'Email ou mot de passe incorrect.'
    } else if (result.status === 403) {
      error.value = 'Accès refusé.'
    } else {
      error.value = 'Une erreur est survenue.'
    }
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
    <!-- Head: logo + title -->
    <div class="v2-card__head">
      <ClownLogo class="mx-auto mb-4 h-9 w-auto" />
      <h1 class="v2-card__title">Connexion a <em>{{ clientName }}</em></h1>
      <p class="v2-card__sub">Utilisez votre compte pour continuer.</p>
    </div>

    <!-- Body -->
    <div class="v2-card__body">
      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <template v-if="needsEmailVerification">
        <AuthAlert severity="warn">
          <template v-if="verificationResent">
            Un nouveau lien de verification a ete envoye a <strong>{{ email }}</strong>.
            Pensez a verifier vos spams.
          </template>
          <template v-else>
            Votre adresse <strong>{{ email }}</strong> n'est pas encore verifiee.
            Cliquez sur le lien recu par email pour activer votre compte.
          </template>
        </AuthAlert>
        <div style="margin-top: 12px; display: flex; gap: 8px;">
          <button
            type="button"
            class="v2-cta v2-cta--ghost"
            :disabled="resendingVerification || verificationResent"
            @click="resendVerification"
            style="flex: 1"
          >
            <span class="v2-cta__main">
              {{ verificationResent ? 'Lien envoye' : (resendingVerification ? 'Envoi...' : 'Renvoyer le lien') }}
            </span>
          </button>
        </div>
      </template>

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

        <label class="flex items-center gap-2 text-[12px] text-fg-2 cursor-pointer mb-3 select-none">
          <input
            type="checkbox"
            v-model="rememberMe"
            class="h-3.5 w-3.5 accent-accent cursor-pointer"
          />
          Se souvenir de moi sur cet appareil
        </label>

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
