<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'

const router = useRouter()
const { state, updateFromLoginResponse } = useAuthState()

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
  <div class="login-page">
    <h2>Connexion</h2>

    <Message v-if="error" severity="error" :closable="false" class="mb-3">{{ error }}</Message>

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
        <RouterLink to="/register">Créer un compte</RouterLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-page h2 {
  text-align: center;
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
  gap: 0.5rem;
}

.field label {
  font-weight: 500;
  font-size: 0.875rem;
}

.links {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.links a {
  color: var(--p-primary-color);
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}

.mb-3 {
  margin-bottom: 0.75rem;
}
</style>
