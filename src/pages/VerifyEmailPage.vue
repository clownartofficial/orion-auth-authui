<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '@/composables/useApi'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'

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
  <V2Card path="auth.orion.io / <b>verify-email</b>">
    <div class="v2-card__head">
      <h1 class="v2-card__title">Verification de votre email</h1>
      <p class="v2-card__sub">Veuillez patienter pendant que nous verifions votre adresse.</p>
    </div>

    <div class="v2-card__body">
      <div v-if="loading" style="display: flex; justify-content: center; padding: 1.5rem 0">
        <div class="auth-spinner"></div>
      </div>

      <template v-if="success">
        <AuthAlert severity="success">
          Votre email a ete verifie avec succes. Vous pouvez maintenant vous connecter.
        </AuthAlert>
      </template>

      <template v-if="error">
        <AuthAlert severity="danger">{{ error }}</AuthAlert>
      </template>
    </div>

    <div v-if="success || error" class="v2-card__foot">
      <RouterLink to="/login">Se connecter</RouterLink>
    </div>
  </V2Card>
</template>
