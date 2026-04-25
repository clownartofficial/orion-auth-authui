<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiPost } from '../composables/useApi'
import { useSettings } from '../composables/useSettings'
import FlowStepIndicator from '@/components/FlowStepIndicator.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import { IconEye } from '@/components/icons'

const route = useRoute()
const router = useRouter()
const { registrationEnabled, fetchSettings } = useSettings()

const inviteToken = computed(() => route.query.invite as string | undefined)
const inviteEmail = computed(() => route.query.email as string | undefined)
const isInvite = computed(() => !!inviteToken.value)

const displayName = ref('')
const email = ref(inviteEmail.value ?? '')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const showPassword = ref(false)
const showConfirm = ref(false)

onMounted(async () => {
  if (!isInvite.value) {
    await fetchSettings()
    if (registrationEnabled.value === false) {
      router.replace('/login')
    }
  }
})

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

  if (isInvite.value) {
    const result = await apiPost('/api/v1/auth/register/invite', {
      token: inviteToken.value,
      password: password.value,
      display_name: displayName.value || undefined,
    })

    loading.value = false

    if (!result.ok) {
      if (result.status === 400) {
        error.value = 'Invitation invalide ou expirée.'
      } else if (result.status === 409) {
        error.value = 'Cette invitation a déjà été utilisée.'
      } else {
        error.value = result.message
      }
      return
    }
  } else {
    const result = await apiPost('/api/v1/auth/register', {
      email: email.value,
      password: password.value,
      display_name: displayName.value || undefined,
    })

    loading.value = false

    if (!result.ok) {
      if (result.status === 403) {
        error.value = "L'inscription publique est désactivée. Contactez un administrateur pour recevoir une invitation."
      } else if (result.status === 409) {
        error.value = 'Un compte existe déjà avec cet email.'
      } else {
        error.value = result.message
      }
      return
    }
  }

  success.value = true
}
</script>

<template>
  <div>
    <FlowStepIndicator label="inscription" />

    <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">
      {{ isInvite ? 'Finaliser votre invitation.' : 'Creer un compte.' }}
    </h2>
    <p class="font-mono text-[11px] text-fg-2 mb-6">
      $ auth --register{{ isInvite ? ' --invite' : '' }}
    </p>

    <template v-if="success">
      <AuthAlert severity="success">
        <template v-if="isInvite">
          Compte créé avec succès. Vous pouvez maintenant vous connecter.
        </template>
        <template v-else>
          Compte créé avec succès. Vérifiez votre email pour activer votre compte.
        </template>
      </AuthAlert>
      <RouterLink
        to="/login"
        class="mt-4 block text-center font-mono text-xs text-accent no-underline transition-colors duration-fast hover:text-accent-hi"
      >
        {{ isInvite ? 'Se connecter' : 'Retour à la connexion' }}
      </RouterLink>
    </template>

    <template v-else>
      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="displayName" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">
            Nom d'affichage
          </label>
          <input
            id="displayName"
            v-model="displayName"
            type="text"
            class="input"
            placeholder="Optionnel"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="email" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="input"
            placeholder="vous@exemple.com"
            :disabled="isInvite"
            required
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">
            Mot de passe
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input"
              placeholder="8 caractères minimum"
              required
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-fg-3 hover:text-fg-0 transition-colors"
              tabindex="-1"
              @click="showPassword = !showPassword"
            >
              <IconEye :size="16" :off="showPassword" />
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="confirmPassword" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">
            Confirmer le mot de passe
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              class="input"
              required
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-fg-3 hover:text-fg-0 transition-colors"
              tabindex="-1"
              @click="showConfirm = !showConfirm"
            >
              <IconEye :size="16" :off="showConfirm" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="auth-btn"
          :disabled="loading"
        >
          {{ loading ? 'Création en cours...' : 'Créer le compte' }}
        </button>

        <div class="text-center font-mono text-xs">
          <RouterLink
            to="/login"
            class="text-accent no-underline transition-colors duration-fast hover:text-accent-hi"
          >
            Déjà un compte ? Se connecter
          </RouterLink>
        </div>
      </form>
    </template>
  </div>
</template>
