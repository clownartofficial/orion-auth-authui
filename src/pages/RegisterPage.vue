<script setup lang="ts">
import { ref } from 'vue'
import { apiPost } from '../composables/useApi'

const displayName = ref('')
const email = ref('')
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

  const result = await apiPost('/api/v1/auth/register', {
    email: email.value,
    password: password.value,
    display_name: displayName.value || undefined,
  })

  loading.value = false

  if (!result.ok) {
    if (result.status === 409) {
      error.value = 'Un compte existe déjà avec cet email.'
    } else if (result.status === 400) {
      error.value = result.message
    } else {
      error.value = result.message
    }
    return
  }

  success.value = true
}
</script>

<template>
  <div class="register-page">
    <h2>Créer un compte</h2>

    <template v-if="success">
      <Message severity="success" :closable="false">
        Compte créé avec succès. Vérifiez votre email pour activer votre compte.
      </Message>
      <RouterLink to="/login" class="back-link">Retour à la connexion</RouterLink>
    </template>

    <template v-else>
      <Message v-if="error" severity="error" :closable="false" class="mb-3">{{ error }}</Message>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="field">
          <label for="displayName">Nom d'affichage</label>
          <InputText
            id="displayName"
            v-model="displayName"
            placeholder="Optionnel"
            fluid
          />
        </div>

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
          label="Créer le compte"
          :loading="loading"
          fluid
        />

        <div class="links">
          <RouterLink to="/login">Déjà un compte ? Se connecter</RouterLink>
        </div>
      </form>
    </template>
  </div>
</template>

<style scoped>
.register-page h2 {
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

.mb-3 {
  margin-bottom: 0.75rem;
}
</style>
