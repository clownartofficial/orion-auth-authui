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
  <div class="verify-email-page">
    <h2>Vérification de l'email</h2>

    <ProgressSpinner v-if="loading" />

    <template v-if="success">
      <Message severity="success" :closable="false">
        Votre email a été vérifié avec succès.
      </Message>
      <RouterLink to="/login" class="back-link">Se connecter</RouterLink>
    </template>

    <template v-if="error">
      <Message severity="error" :closable="false">{{ error }}</Message>
    </template>
  </div>
</template>

<style scoped>
.verify-email-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.verify-email-page h2 {
  margin-bottom: 0.5rem;
}

.back-link {
  font-size: 0.875rem;
  color: var(--p-primary-color);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
