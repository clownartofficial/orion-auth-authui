<script setup lang="ts">
import { ref } from 'vue'
import { apiPost } from '../composables/useApi'
import FlowStepIndicator from '../components/FlowStepIndicator.vue'
import AuthAlert from '../components/AuthAlert.vue'
import { IconArrowLeft, IconChevron } from '../components/icons'

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
    <RouterLink
      to="/login"
      class="mb-3 flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg-0 no-underline"
    >
      <IconArrowLeft :size="13" /> Retour
    </RouterLink>

    <FlowStepIndicator label="mot de passe oublie" />

    <h1 class="mb-2 font-display text-[32px] font-normal leading-[1.15] tracking-[-0.015em] text-fg-0">
      Reinitialiser le mot de passe.
    </h1>
    <p class="mb-7 text-[13.5px] leading-[1.55] text-fg-2">
      Entrez votre adresse email et vous recevrez un lien de reinitialisation.
    </p>

    <template v-if="submitted">
      <AuthAlert severity="success">
        Si un compte existe avec cet email, vous recevrez un lien de reinitialisation.
      </AuthAlert>
      <div class="mt-4 text-center text-[12.5px] text-fg-2">
        <RouterLink to="/login" class="font-medium text-accent no-underline hover:underline">Retour a la connexion</RouterLink>
      </div>
    </template>

    <template v-else>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3.5 flex flex-col gap-1.5">
          <label for="email" class="font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] text-fg-2">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input"
            placeholder="vous@exemple.com"
            required
            autofocus
          />
        </div>

        <button type="submit" class="auth-btn" :disabled="loading">
          {{ loading ? 'Envoi...' : 'Envoyer le lien' }}
          <IconChevron v-if="!loading" :size="14" />
        </button>
      </form>

      <div class="mt-[18px] text-center text-[12.5px] text-fg-2">
        <RouterLink to="/login" class="font-medium text-accent no-underline hover:underline">Retour a la connexion</RouterLink>
      </div>
    </template>
  </div>
</template>
