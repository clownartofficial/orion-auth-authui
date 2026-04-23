<script setup lang="ts">
import { ref } from 'vue'
import { apiPost } from '../composables/useApi'

const email = ref('')
const loading = ref(false)
const submitted = ref(false)

async function handleSubmit() {
  loading.value = true

  await apiPost('/api/v1/auth/forgot-password', {
    email: email.value,
  })

  loading.value = false
  submitted.value = true
}
</script>

<template>
  <div class="page">
    <h2 class="page-title">Mot de passe oublié</h2>
    <p class="page-sub">$ auth --reset-request</p>

    <template v-if="submitted">
      <Message severity="info" :closable="false">
        Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
      </Message>
      <RouterLink to="/login" class="back-link">Retour à la connexion</RouterLink>
    </template>

    <template v-else>
      <p class="page-desc">Entrez votre email pour recevoir un lien de réinitialisation.</p>

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

        <Button
          type="submit"
          label="Envoyer le lien"
          :loading="loading"
          fluid
        />

        <div class="links">
          <RouterLink to="/login">Retour à la connexion</RouterLink>
        </div>
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
  margin-bottom: 0.5rem;
}

.page-desc {
  text-align: center;
  font-size: 13px;
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

.links {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 12px;
}

.links a,
.back-link {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.15s;
}

.links a:hover,
.back-link:hover {
  color: var(--accent-hi);
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 12px;
}
</style>
