<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiPost } from '@/composables/useApi'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import { useTheme } from '@/composables/useTheme'
import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'
import { IconEye, IconChevron } from '@/components/icons'

const route = useRoute()
const router = useRouter()

const token = computed(() => (route.query.token as string) || '')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const { theme } = useTheme()
const logoSrc = computed(() => theme.value === 'dark' ? logoDark : logoLight)

onMounted(() => {
  if (!token.value) {
    error.value = 'Lien invalide.'
  }
})

async function handleSubmit() {
  error.value = null
  loading.value = true
  const result = await apiPost<{ redirect?: string; user_id?: string }>(
    '/api/v1/auth/federation/confirm-link',
    { token: token.value, password: password.value },
  )
  loading.value = false
  if (!result.ok) {
    if (result.status === 401) {
      error.value = 'Mot de passe incorrect.'
    } else if (result.message) {
      error.value = result.message
    } else {
      error.value = 'La confirmation a echoue.'
    }
    return
  }
  if (result.data.redirect) {
    window.location.href = result.data.redirect
    return
  }
  router.push('/login')
}
</script>

<template>
  <V2Card path="auth.orion.io / <b>link-account</b>">
    <div class="v2-card__head">
      <div class="v2-orbit">
        <img :src="logoSrc" alt="OrionAuth" class="h-16 w-16" style="filter: drop-shadow(0 0 18px var(--accent-bg))" />
        <span class="v2-orbit__satellite" />
      </div>
      <h1 class="v2-card__title">Lier votre compte existant</h1>
      <p class="v2-card__sub">
        L'adresse email retournee par le fournisseur correspond a un compte existant.
        Saisissez son mot de passe pour confirmer la liaison.
      </p>
    </div>

    <div class="v2-card__body">
      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <form @submit.prevent="handleSubmit">
        <div class="v2-field">
          <label class="v2-field__label">Mot de passe local</label>
          <div class="v2-input-wrap">
            <span class="v2-input-wrap__icon"><IconEye :size="15" /></span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
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
              {{ showPassword ? 'masquer' : 'afficher' }}
            </button>
          </div>
        </div>

        <button type="submit" class="v2-cta" :disabled="loading || !token">
          <span class="v2-cta__main">
            {{ loading ? 'Verification\u2026' : 'Confirmer la liaison' }}
            <IconChevron v-if="!loading" :size="14" />
          </span>
          <span class="v2-cta__kbd">&#9166; enter</span>
        </button>
      </form>
    </div>

    <div class="v2-card__foot">
      <RouterLink to="/login">Annuler et revenir a la connexion</RouterLink>
    </div>
  </V2Card>
</template>
