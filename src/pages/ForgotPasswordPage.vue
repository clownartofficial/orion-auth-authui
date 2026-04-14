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
  <div class="forgot-password-page">
    <h2>Mot de passe oublié</h2>

    <template v-if="submitted">
      <Message severity="info" :closable="false">
        Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
      </Message>
      <RouterLink to="/login" class="back-link">Retour à la connexion</RouterLink>
    </template>

    <template v-else>
      <p class="subtitle">Entrez votre email pour recevoir un lien de réinitialisation.</p>

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
.forgot-password-page h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
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
  text-align: center;
  font-size: 0.875rem;
}

.links a,
.back-link {
  color: var(--p-primary-color);
  text-decoration: none;
}

.links a:hover,
.back-link:hover {
  text-decoration: underline;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
}
</style>
