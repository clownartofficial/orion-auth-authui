<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '../composables/useApi'
import AuthAlert from '../components/AuthAlert.vue'

const route = useRoute()
const token = route.query.token as string | undefined

const loading = ref(true)
const error = ref<string | null>(null)
const success = ref(false)

onMounted(async () => {
  if (!token) {
    error.value = 'Lien de verification invalide.'
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
    <h1 class="mb-2 font-display text-[32px] font-normal leading-[1.15] tracking-[-0.015em] text-fg-0">
      Verification de votre email...
    </h1>
    <p class="mb-7 text-[13.5px] leading-[1.55] text-fg-2">
      Veuillez patienter pendant que nous verifions votre adresse.
    </p>

    <div class="flex flex-col items-center gap-5">
      <div v-if="loading" class="auth-spinner"></div>

      <template v-if="success">
        <AuthAlert severity="success">
          Votre email a ete verifie avec succes. Vous pouvez maintenant vous connecter.
        </AuthAlert>
        <RouterLink to="/login" class="font-medium text-[12.5px] text-accent no-underline hover:underline">
          Se connecter
        </RouterLink>
      </template>

      <template v-if="error">
        <AuthAlert severity="danger">{{ error }}</AuthAlert>
      </template>
    </div>
  </div>
</template>
