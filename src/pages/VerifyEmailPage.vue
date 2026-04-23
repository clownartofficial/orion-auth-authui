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
  <div class="page">
    <h2 class="page-title">Vérification de l'email</h2>
    <p class="page-sub">$ auth --verify-email</p>

    <div class="content">
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

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.back-link {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--accent-hi);
}
</style>
