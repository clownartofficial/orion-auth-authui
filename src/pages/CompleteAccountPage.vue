<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiGet, apiPost } from '@/composables/useApi'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import { useTheme } from '@/composables/useTheme'
import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'
import { IconChevron, IconEye, IconMail } from '@/components/icons'

const route = useRoute()
const router = useRouter()

interface PendingSignupView {
  provider_name: string
  provider_display_name: string
  email: string
  email_verified: boolean
  display_name: string
  expires_at: string
}

const token = computed(() => (route.query.token as string) || '')
const view = ref<PendingSignupView | null>(null)
const displayName = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const loadingPreview = ref(true)
const error = ref<string | null>(null)

const { theme } = useTheme()
const logoSrc = computed(() => theme.value === 'dark' ? logoDark : logoLight)

onMounted(async () => {
  if (!token.value) {
    error.value = 'Lien invalide.'
    loadingPreview.value = false
    return
  }
  const result = await apiGet<PendingSignupView>(
    `/api/v1/auth/federation/pending-signup?token=${encodeURIComponent(token.value)}`,
  )
  loadingPreview.value = false
  if (!result.ok) {
    error.value = result.message || 'Token expire ou invalide.'
    return
  }
  view.value = result.data
  displayName.value = result.data.display_name || ''
})

async function handleSubmit() {
  error.value = null
  if (password.value !== confirmPassword.value) {
    error.value = 'Les deux mots de passe ne correspondent pas.'
    return
  }
  loading.value = true
  const result = await apiPost<{ redirect?: string; user_id?: string }>(
    '/api/v1/auth/federation/complete-signup',
    {
      token: token.value,
      password: password.value,
      display_name: displayName.value,
    },
  )
  loading.value = false
  if (!result.ok) {
    error.value = result.message || 'La creation du compte a echoue.'
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
  <V2Card path="auth.orion.io / <b>complete-account</b>">
    <div class="v2-card__head">
      <div class="v2-orbit">
        <img :src="logoSrc" alt="OrionAuth" class="h-16 w-16" style="filter: drop-shadow(0 0 18px var(--accent-bg))" />
        <span class="v2-orbit__satellite" />
      </div>
      <h1 class="v2-card__title">Finaliser votre compte</h1>
      <p class="v2-card__sub" v-if="view">
        Vous avez authentifie via <strong>{{ view.provider_display_name }}</strong>.
        Choisissez un mot de passe local pour terminer la creation.
      </p>
    </div>

    <div class="v2-card__body">
      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>
      <p v-if="loadingPreview" class="text-color-secondary text-[13px]">Verification du lien\u2026</p>

      <form v-if="view" @submit.prevent="handleSubmit">
        <div class="v2-field">
          <label class="v2-field__label">Email</label>
          <div class="v2-input-wrap">
            <span class="v2-input-wrap__icon"><IconMail :size="15" /></span>
            <input :value="view.email" type="email" readonly />
          </div>
        </div>

        <div class="v2-field">
          <label class="v2-field__label">Nom affiche</label>
          <div class="v2-input-wrap">
            <input v-model="displayName" type="text" placeholder="Optionnel" />
          </div>
        </div>

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

        <div class="v2-field">
          <label class="v2-field__label">Confirmer le mot de passe</label>
          <div class="v2-input-wrap">
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              required
            />
          </div>
        </div>

        <button type="submit" class="v2-cta" :disabled="loading">
          <span class="v2-cta__main">
            {{ loading ? 'Creation\u2026' : 'Creer mon compte' }}
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
