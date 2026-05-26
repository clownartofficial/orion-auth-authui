<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '@/composables/useApi'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import PasswordStrength from '@/components/PasswordStrength.vue'
import { IconEye, IconChevron } from '@/components/icons'

const route = useRoute()
const token = route.query.token as string | undefined

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const passwordValid = ref(false)

async function handleSubmit() {
  error.value = null

  if (!passwordValid.value) {
    error.value = 'Le mot de passe ne respecte pas la politique de securite.'
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
  <V2Card path="auth.orion.io / <b>reset</b>">
    <div class="v2-card__head">
      <h1 class="v2-card__title">Nouveau mot de passe</h1>
      <p class="v2-card__sub">Choisissez un nouveau mot de passe qui respecte les regles ci-dessous.</p>
    </div>

    <div class="v2-card__body">
      <AuthAlert v-if="!token" severity="danger">
        Lien de reinitialisation invalide ou expire.
      </AuthAlert>

      <template v-else-if="success">
        <AuthAlert severity="success">
          Mot de passe reinitialise avec succes.
        </AuthAlert>
      </template>

      <template v-else>
        <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

        <form @submit.prevent="handleSubmit">
          <div class="v2-field">
            <label class="v2-field__label">Nouveau mot de passe</label>
            <div class="v2-input-wrap">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nouveau mot de passe"
                required
                autofocus
              />
              <button
                type="button"
                class="v2-input-wrap__suffix cursor-pointer border-none bg-transparent"
                style="border-left: 1px solid var(--border-subtle)"
                @click="showPassword = !showPassword"
                tabindex="-1"
              >
                <IconEye :size="15" :off="showPassword" />
              </button>
            </div>
            <PasswordStrength
              :password="password"
              @update:valid="passwordValid = $event"
            />
          </div>

          <div class="v2-field">
            <label class="v2-field__label">Confirmer le mot de passe</label>
            <div class="v2-input-wrap">
              <input
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Repetez le mot de passe"
                required
              />
              <button
                type="button"
                class="v2-input-wrap__suffix cursor-pointer border-none bg-transparent"
                style="border-left: 1px solid var(--border-subtle)"
                @click="showConfirm = !showConfirm"
                tabindex="-1"
              >
                <IconEye :size="15" :off="showConfirm" />
              </button>
            </div>
          </div>

          <button type="submit" class="v2-cta" :disabled="loading || !passwordValid">
            <span class="v2-cta__main">
              {{ loading ? 'Reinitialisation...' : 'Reinitialiser' }}
              <IconChevron v-if="!loading" :size="14" />
            </span>
            <span class="v2-cta__kbd">&#9166; enter</span>
          </button>
        </form>
      </template>
    </div>

    <div class="v2-card__foot">
      <RouterLink to="/login">
        {{ success ? 'Se connecter' : 'Retour a la connexion' }}
      </RouterLink>
    </div>
  </V2Card>
</template>
