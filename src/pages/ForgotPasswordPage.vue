<script setup lang="ts">
import { ref } from 'vue'
import { apiPost } from '@/composables/useApi'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import { IconMail, IconChevron } from '@/components/icons'

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
  <V2Card path="auth.orion.io / <b>forgot</b>">
    <div class="v2-card__head">
      <h1 class="v2-card__title">Reinitialiser le mot de passe</h1>
      <p class="v2-card__sub">Entrez votre adresse email et vous recevrez un lien de reinitialisation.</p>
    </div>

    <div class="v2-card__body">
      <template v-if="submitted">
        <AuthAlert severity="success">
          Si un compte existe avec cet email, vous recevrez un lien de reinitialisation.
        </AuthAlert>
      </template>

      <template v-else>
        <form @submit.prevent="handleSubmit">
          <div class="v2-field">
            <label class="v2-field__label">Email</label>
            <div class="v2-input-wrap">
              <span class="v2-input-wrap__icon"><IconMail :size="15" /></span>
              <input
                v-model="email"
                type="email"
                placeholder="vous@exemple.com"
                required
                autofocus
              />
            </div>
          </div>

          <button type="submit" class="v2-cta" :disabled="loading">
            <span class="v2-cta__main">
              {{ loading ? 'Envoi...' : 'Envoyer le lien' }}
              <IconChevron v-if="!loading" :size="14" />
            </span>
            <span class="v2-cta__kbd">&#9166; enter</span>
          </button>
        </form>
      </template>
    </div>

    <div class="v2-card__foot">
      <RouterLink to="/login">Retour a la connexion</RouterLink>
    </div>
  </V2Card>
</template>
