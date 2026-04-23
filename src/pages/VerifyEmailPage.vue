<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '../composables/useApi'

const route = useRoute()
const token = route.query.token as string | undefined

const loading = ref(true)
const error = ref<string | null>(null)
const success = ref(false)

onMounted(async () => {
  if (!token) {
    error.value = 'Lien de vérification invalide.'
    loading.value = false
    return
  }

  const result = await apiPost('/api/v1/auth/verify-email', { token })

  loading.value = false

  if (!result.ok) {
    error.value = result.message
    return
  }

  success.value = true
})
</script>

<template>
  <div>
    <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">Vérification de l'email</h2>
    <p class="font-mono text-[11px] text-fg-2 mb-6">$ auth --verify-email</p>

    <div class="flex flex-col items-center gap-4">
      <ProgressSpinner v-if="loading" />

      <template v-if="success">
        <Message severity="success" :closable="false">
          Votre email a été vérifié avec succès.
        </Message>
        <RouterLink to="/login" class="font-mono text-xs text-accent no-underline transition-colors duration-fast hover:text-accent-hi">Se connecter</RouterLink>
      </template>

      <template v-if="error">
        <Message severity="error" :closable="false">{{ error }}</Message>
      </template>
    </div>
  </div>
</template>
