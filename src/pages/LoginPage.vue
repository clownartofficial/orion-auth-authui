<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'
import { useSettings } from '../composables/useSettings'

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
    <div class="auth-step">
      <span class="auth-step-dot"></span>
      Sign in
    </div>
    <h2 class="auth-title display">Connexion</h2>
    <p class="auth-sub">Entrez vos identifiants pour continuer</p>

    <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="auth-field">
        <label for="email" class="auth-field-label">Email</label>
        <InputText
          id="email"
          v-model="email"
          type="email"
          placeholder="vous@exemple.com"
          required
          fluid
        />
      </div>

      <div class="auth-field">
        <div class="auth-field-label">
          <label for="password">Mot de passe</label>
          <RouterLink to="/forgot-password" class="auth-field-link">Mot de passe oublié ?</RouterLink>
        </div>
        <Password
          id="password"
          v-model="password"
          :feedback="false"
          toggle-mask
          required
          fluid
        />
      </div>

      <button type="submit" class="auth-btn" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>

      <div class="auth-foot" v-if="registrationEnabled !== false">
        Pas encore de compte ? <RouterLink to="/register">Créer un compte</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-step {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
  margin-bottom: 14px;
}
.auth-step-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse-dot 2s ease-in-out infinite;
}

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

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
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
.auth-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.auth-foot {
  font-size: 12.5px;
  color: var(--fg-2);
  text-align: center;
  margin-top: var(--s-2);
}
.auth-foot a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}
.auth-foot a:hover { text-decoration: underline; }

.msg {
  margin-bottom: var(--s-2);
}
</style>
