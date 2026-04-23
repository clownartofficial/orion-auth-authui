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
  <div>
    <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">Mot de passe oublié</h2>
    <p class="font-mono text-[11px] text-fg-2 mb-2">$ auth --reset-request</p>

    <template v-if="submitted">
      <Message severity="info" :closable="false">
        Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
      </Message>
      <RouterLink to="/login" class="mt-4 block text-center font-mono text-xs text-accent no-underline transition-colors duration-fast hover:text-accent-hi">Retour à la connexion</RouterLink>
    </template>

    <template v-else>
      <p class="text-[13px] text-fg-2 mb-6">Entrez votre email pour recevoir un lien de réinitialisation.</p>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">Email</label>
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

        <div class="text-center font-mono text-xs">
          <RouterLink to="/login" class="text-accent no-underline transition-colors duration-fast hover:text-accent-hi">Retour à la connexion</RouterLink>
        </div>
      </form>
    </template>
  </div>
</template>
