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
  <div>
    <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">Réinitialiser le mot de passe</h2>
    <p class="font-mono text-[11px] text-fg-2 mb-6">$ auth --reset-password</p>

    <Message v-if="!token" severity="error" :closable="false">
      Lien de réinitialisation invalide.
    </Message>

    <template v-else-if="success">
      <Message severity="success" :closable="false">
        Mot de passe réinitialisé avec succès.
      </Message>
      <RouterLink to="/login" class="mt-4 block text-center font-mono text-xs text-accent no-underline transition-colors duration-fast hover:text-accent-hi">Se connecter</RouterLink>
    </template>

    <template v-else>
      <Message v-if="error" severity="error" :closable="false" class="mb-2">{{ error }}</Message>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="password" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">Nouveau mot de passe</label>
          <Password
            id="password"
            v-model="password"
            :feedback="false"
            toggle-mask
            required
            fluid
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="confirmPassword" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">Confirmer le mot de passe</label>
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
