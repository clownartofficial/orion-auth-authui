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
    <h2 class="page-title">Connexion</h2>
    <p class="page-sub">$ auth --login</p>

    <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="field">
        <label for="email">Email</label>
        <InputText
          id="email"
          v-model="email"
          type="email"
          placeholder="vous@exemple.com"
          required
          fluid
        />
      </div>

      <div class="field">
        <label for="password">Mot de passe</label>
        <Password
          id="password"
          v-model="password"
          :feedback="false"
          toggle-mask
          required
          fluid
        />
      </div>

      <Button
        type="submit"
        label="Se connecter"
        :loading="loading"
        fluid
      />

      <div class="links">
        <RouterLink to="/forgot-password">Mot de passe oublié ?</RouterLink>
        <RouterLink v-if="registrationEnabled !== false" to="/register">Créer un compte</RouterLink>
      </div>
    </form>
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
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-family: var(--nh-mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--nh-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.links {
  display: flex;
  justify-content: space-between;
  font-family: var(--nh-mono);
  font-size: 12px;
}

.links a {
  color: var(--nh-accent);
  text-decoration: none;
  transition: color 0.15s;
}

.links a:hover {
  color: var(--nh-accent-hover);
}

.msg {
  margin-bottom: 0.5rem;
}
</style>
