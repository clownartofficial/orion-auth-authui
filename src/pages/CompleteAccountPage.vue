<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiGet, apiPost } from '@/composables/useApi'
import { useRegistrationSchema, initialValues } from '@/composables/useRegistrationSchema'
import { FIRST_CLASS_TARGETS } from '@/types/registrationField.types'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import DynamicField from '@/components/DynamicField.vue'
import PasswordStrength from '@/components/PasswordStrength.vue'
import ClownLogo from '@/components/icons/ClownLogo.vue'
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
const passwordValid = ref(false)

const { schema, fetchSchema } = useRegistrationSchema('federation')
const extras = ref<Record<string, unknown>>({})
const renderedSchema = computed(() =>
  schema.value.filter((f) => !(f.kind === 'standard' && f.standard_target && FIRST_CLASS_TARGETS.has(f.standard_target))),
)

onMounted(async () => {
  if (!token.value) {
    error.value = 'Lien invalide.'
    loadingPreview.value = false
    return
  }
  const [preview] = await Promise.all([
    apiGet<PendingSignupView>(
      `/api/v1/auth/federation/pending-signup?token=${encodeURIComponent(token.value)}`,
    ),
    fetchSchema(),
  ])
  loadingPreview.value = false
  if (!preview.ok) {
    error.value = preview.message || 'Token expire ou invalide.'
    return
  }
  view.value = preview.data
  displayName.value = preview.data.display_name || ''
  extras.value = initialValues(renderedSchema.value)
})

async function handleSubmit() {
  error.value = null
  if (!passwordValid.value) {
    error.value = 'Le mot de passe ne respecte pas la politique de securite.'
    return
  }
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
      extra_fields: Object.keys(extras.value).length > 0 ? extras.value : undefined,
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
      <ClownLogo class="mx-auto mb-4 h-9 w-auto" />
      <h1 class="v2-card__title">Finaliser votre compte</h1>
      <p class="v2-card__sub" v-if="view">
        Vous avez authentifie via <strong>{{ view.provider_display_name }}</strong>.
        Choisissez un mot de passe local pour terminer la creation.
      </p>
    </div>

    <div class="v2-card__body">
      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>
      <p v-if="loadingPreview" class="text-color-secondary text-[13px]">Vérification du lien…</p>

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
              placeholder="••••••••••••"
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
          <PasswordStrength
            v-if="view"
            :password="password"
            :user-inputs="[view.email, displayName]"
            @update:valid="passwordValid = $event"
          />
        </div>

        <div class="v2-field">
          <label class="v2-field__label">Confirmer le mot de passe</label>
          <div class="v2-input-wrap">
            <input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••••••"
              required
            />
          </div>
        </div>

        <DynamicField
          v-for="field in renderedSchema"
          :key="field.id"
          :field="field"
          v-model="extras[field.field_key]"
        />

        <button type="submit" class="v2-cta" :disabled="loading || !passwordValid">
          <span class="v2-cta__main">
            {{ loading ? 'Création…' : 'Créer mon compte' }}
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
