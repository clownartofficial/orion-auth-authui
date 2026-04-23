<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '../composables/useApi'

const route = useRoute()
const token = route.query.token as string | undefined

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

async function handleSubmit() {
  error.value = null

  if (password.value.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true

  const result = await apiPost('/api/v1/auth/reset-password', {
    token: token,
    new_password: password.value,
  })

  loading.value = false

  if (!result.ok) {
    error.value = result.message
    return
  }

  success.value = true
}
</script>

<template>
  <div class="page">
    <h2 class="page-title">Réinitialiser le mot de passe</h2>
    <p class="page-sub">$ auth --reset-password</p>

    <Message v-if="!token" severity="error" :closable="false">
      Lien de réinitialisation invalide.
    </Message>

    <template v-else-if="success">
      <Message severity="success" :closable="false">
        Mot de passe réinitialisé avec succès.
      </Message>
      <RouterLink to="/login" class="back-link">Se connecter</RouterLink>
    </template>

    <template v-else>
      <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="field">
          <label for="password">Nouveau mot de passe</label>
          <Password
            id="password"
            v-model="password"
            :feedback="false"
            toggle-mask
            required
            fluid
          />
        </div>

        <div class="field">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <Password
            id="confirmPassword"
            v-model="confirmPassword"
            :feedback="false"
            toggle-mask
            required
            fluid
          />
        </div>

        <Button
          type="submit"
          label="Réinitialiser"
          :loading="loading"
          fluid
        />
      </form>
    </template>
  </div>
</template>

<style scoped>
.page-title {
  text-align: center;
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-bottom: 2px;
}

.page-sub {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-2);
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
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--fg-2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--accent-hi);
}

.msg {
  margin-bottom: 0.5rem;
}
</style>
