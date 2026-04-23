<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'
import { useSettings } from '../composables/useSettings'
import FlowStepIndicator from '../components/FlowStepIndicator.vue'
// import AuthDivider from '../components/AuthDivider.vue'
// import FederatedButtons from '../components/FederatedButtons.vue'

const router = useRouter()
const { state, updateFromLoginResponse } = useAuthState()
const { registrationEnabled, fetchSettings } = useSettings()

onMounted(fetchSettings)

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
    const url = new URL(data.redirect_uri)
    url.searchParams.set('code', data.code)
    if (data.state) url.searchParams.set('state', data.state)
    window.location.href = url.toString()
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
  <div class="page">
    <FlowStepIndicator label="sign in" :step="1" :total="3" />
    <h1 class="auth-title display">Welcome back.</h1>
    <p class="auth-sub">Entrez votre email pour continuer. Nous détecterons votre provider automatiquement.</p>

    <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

    <form @submit.prevent="handleSubmit">
      <div class="auth-field">
        <label class="auth-field-label">Email</label>
        <InputText
          v-model="email"
          type="email"
          placeholder="vous@entreprise.com"
          required
          fluid
        />
        <div class="auth-field-hint">Détection SSO automatique pour votre domaine.</div>
      </div>

      <div class="auth-field">
        <div class="auth-field-label">
          <span>Mot de passe</span>
          <RouterLink to="/forgot-password" class="auth-field-link">Oublié ?</RouterLink>
        </div>
        <Password
          v-model="password"
          :feedback="false"
          toggle-mask
          required
          fluid
        />
      </div>

      <button type="submit" class="auth-btn" :disabled="loading">
        {{ loading ? 'Connexion…' : 'Continuer' }}
        <svg v-if="!loading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </form>

    <!-- TODO: Passkey sign-in (needs WebAuthn backend support)
    <button class="fed-btn fed-btn--passkey" type="button">
      Se connecter avec un passkey
    </button>
    -->

    <!-- TODO: Federated login (needs federation backend)
    <AuthDivider text="ou continuer avec" />
    <FederatedButtons />
    -->

    <div class="auth-foot" v-if="registrationEnabled !== false">
      Pas encore de compte ? <RouterLink to="/register">Créer un compte</RouterLink>
    </div>
  </div>
</template>

<style scoped>
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

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.auth-field-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--fg-2);
}
.auth-field-link {
  color: var(--accent);
  text-decoration: none;
  text-transform: none;
  letter-spacing: 0;
  font-size: 11.5px;
}
.auth-field-link:hover { text-decoration: underline; }
.auth-field-hint {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-3);
}

.auth-btn {
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 600;
  border: none;
  background: var(--accent);
  color: var(--fg-0);
  cursor: pointer;
  transition: all var(--t-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  margin-top: var(--s-2);
}
.auth-btn:hover {
  background: var(--accent-hi);
  box-shadow: 0 8px 20px -8px var(--accent);
  transform: translateY(-1px);
}
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

.fed-btn--passkey {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--bg-1);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  color: var(--fg-0);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--t-fast);
  font-family: inherit;
  margin-top: 10px;
  width: 100%;
}
.fed-btn--passkey:hover {
  background: var(--bg-2);
  border-color: var(--border-strong);
  transform: translateY(-1px);
}

.auth-foot {
  font-size: 12.5px;
  color: var(--fg-2);
  text-align: center;
  margin-top: 18px;
}
.auth-foot a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}
.auth-foot a:hover { text-decoration: underline; }

.msg { margin-bottom: var(--s-2); }
</style>
