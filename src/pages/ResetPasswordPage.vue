<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '../composables/useApi'
import FlowStepIndicator from '../components/FlowStepIndicator.vue'
import AuthAlert from '../components/AuthAlert.vue'
import { IconEye, IconChevron } from '../components/icons'

const route = useRoute()
const token = route.query.token as string | undefined

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

async function handleSubmit() {
  error.value = null

  if (password.value.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caracteres.'
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
    <FlowStepIndicator label="nouveau mot de passe" />

    <h1 class="mb-2 font-display text-[32px] font-normal leading-[1.15] tracking-[-0.015em] text-fg-0">
      Choisissez un nouveau mot de passe.
    </h1>
    <p class="mb-7 text-[13.5px] leading-[1.55] text-fg-2">
      Votre nouveau mot de passe doit contenir au moins 8 caracteres.
    </p>

    <AuthAlert v-if="!token" severity="danger">
      Lien de reinitialisation invalide ou expire.
    </AuthAlert>

    <template v-else-if="success">
      <AuthAlert severity="success">
        Mot de passe reinitialise avec succes.
      </AuthAlert>
      <div class="mt-4 text-center text-[12.5px] text-fg-2">
        <RouterLink to="/login" class="font-medium text-accent no-underline hover:underline">Se connecter</RouterLink>
      </div>
    </template>

    <template v-else>
      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3.5 flex flex-col gap-1.5">
          <label for="password" class="font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-2">
            Nouveau mot de passe
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input pr-10"
              placeholder="••••••••••••"
              required
              autofocus
            />
            <button
              type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-fg-3 hover:text-fg-0 p-1"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <IconEye :size="16" :off="showPassword" />
            </button>
          </div>
        </div>

        <div class="mb-3.5 flex flex-col gap-1.5">
          <label for="confirmPassword" class="font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-2">
            Confirmer le mot de passe
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              class="input pr-10"
              placeholder="••••••••••••"
              required
            />
            <button
              type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-fg-3 hover:text-fg-0 p-1"
              @click="showConfirm = !showConfirm"
              tabindex="-1"
            >
              <IconEye :size="16" :off="showConfirm" />
            </button>
          </div>
        </div>

        <button type="submit" class="auth-btn" :disabled="loading">
          {{ loading ? 'Reinitialisation...' : 'Reinitialiser' }}
          <IconChevron v-if="!loading" :size="14" />
        </button>
      </form>

      <div class="mt-[18px] text-center text-[12.5px] text-fg-2">
        <RouterLink to="/login" class="font-medium text-accent no-underline hover:underline">Retour a la connexion</RouterLink>
      </div>
    </template>
  </div>
</template>
