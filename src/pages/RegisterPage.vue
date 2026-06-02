<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiGet, apiPost } from '@/composables/useApi'
import { useSettings } from '@/composables/useSettings'
import { useRegistrationSchema, initialValues } from '@/composables/useRegistrationSchema'
import { FIRST_CLASS_TARGETS } from '@/types/registrationField.types'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import DynamicField from '@/components/DynamicField.vue'
import PasswordStrength from '@/components/PasswordStrength.vue'
import { IconEye, IconChevron } from '@/components/icons'

const route = useRoute()
const router = useRouter()
const { registrationEnabled, postRegisterRedirectUrl, fetchSettings } = useSettings()
const { schema, fetchSchema } = useRegistrationSchema('register')

const inviteToken = computed(() => route.query.invite as string | undefined)
const isInvite = computed(() => !!inviteToken.value)

const inviteEmail = ref<string | null>(null)
const inviteInvalid = ref(false)
const inviteResolving = ref(false)

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const extras = ref<Record<string, unknown>>({})

const showPassword = ref(false)
const showConfirm = ref(false)
const passwordValid = ref(false)

// The hardcoded displayName input already covers the display_name
// standard target — hide the dynamic copy if the admin enabled it too.
const renderedSchema = computed(() =>
  schema.value.filter((f) => !(f.kind === 'standard' && f.standard_target && FIRST_CLASS_TARGETS.has(f.standard_target))),
)

onMounted(async () => {
  await Promise.all([
    isInvite.value ? resolveInvite() : fetchSettings(),
    fetchSchema(),
  ])
  if (!isInvite.value && registrationEnabled.value === false) {
    router.replace('/login')
    return
  }
  extras.value = initialValues(renderedSchema.value)
})

async function resolveInvite() {
  if (!inviteToken.value) return
  inviteResolving.value = true
  const result = await apiGet<{ email: string; expires_at: string }>(
    '/api/v1/auth/invitations/lookup',
    { token: inviteToken.value },
  )
  inviteResolving.value = false
  if (!result.ok) {
    inviteInvalid.value = true
    return
  }
  inviteEmail.value = result.data.email
  email.value = result.data.email
}

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

  if (isInvite.value) {
    const result = await apiPost('/api/v1/auth/register/invite', {
      token: inviteToken.value,
      password: password.value,
      display_name: displayName.value || undefined,
      extra_fields: Object.keys(extras.value).length > 0 ? extras.value : undefined,
    })

    loading.value = false

    if (!result.ok) {
      if (result.status === 400) {
        error.value = 'Invitation invalide ou expiree.'
      } else if (result.status === 409) {
        error.value = 'Cette invitation a deja ete utilisee.'
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
      extra_fields: Object.keys(extras.value).length > 0 ? extras.value : undefined,
    })

    loading.value = false

    if (!result.ok) {
      if (result.status === 403) {
        error.value = "L'inscription publique est desactivee. Contactez un administrateur pour recevoir une invitation."
      } else if (result.status === 409) {
        error.value = 'Un compte existe deja avec cet email.'
      } else {
        error.value = result.message
      }
      return
    }
  }

  success.value = true

  // After a standalone register (no OAuth flow), if the operator
  // configured a landing URL we send the user there. Invite-driven
  // registers keep the "Se connecter" link instead because they don't
  // usually originate from a SPA.
  if (!isInvite.value && postRegisterRedirectUrl.value) {
    setTimeout(() => {
      window.location.href = postRegisterRedirectUrl.value
    }, 1500)
  }
}
</script>

<template>
  <V2Card path="auth.orion.io / <b>register</b>">
    <div class="v2-card__head">
      <h1 class="v2-card__title">
        {{ isInvite ? 'Finaliser votre invitation' : 'Creer un compte' }}
      </h1>
      <p class="v2-card__sub">
        <template v-if="isInvite && inviteEmail">
          Invitation pour <strong>{{ inviteEmail }}</strong>
        </template>
        <template v-else-if="isInvite">
          Completez votre profil pour activer votre compte.
        </template>
        <template v-else>
          Remplissez les informations ci-dessous.
        </template>
      </p>
    </div>

    <div class="v2-card__body">
      <template v-if="success">
        <AuthAlert severity="success">
          <template v-if="isInvite">
            Compte cree avec succes. Vous pouvez maintenant vous connecter.
          </template>
          <template v-else>
            Compte cree avec succes. Verifiez votre email pour activer votre compte.
          </template>
        </AuthAlert>
      </template>

      <template v-else-if="inviteInvalid">
        <AuthAlert severity="danger">
          Cette invitation est invalide ou a expire. Contactez un administrateur
          pour en recevoir une nouvelle.
        </AuthAlert>
      </template>

      <template v-else-if="isInvite && inviteResolving">
        <p class="text-[13px] text-fg-2 text-center">Verification de l'invitation...</p>
      </template>

      <template v-else>
        <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

        <form @submit.prevent="handleSubmit">
          <div class="v2-field">
            <label class="v2-field__label">Nom d'affichage</label>
            <div class="v2-input-wrap">
              <input
                v-model="displayName"
                type="text"
                placeholder="Optionnel"
              />
            </div>
          </div>

          <div v-if="!isInvite" class="v2-field">
            <label class="v2-field__label">Email</label>
            <div class="v2-input-wrap">
              <input
                v-model="email"
                type="email"
                placeholder="vous@exemple.com"
                required
              />
            </div>
          </div>

          <div class="v2-field">
            <label class="v2-field__label">Mot de passe</label>
            <div class="v2-input-wrap">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Choisissez un mot de passe"
                required
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
              :user-inputs="[email, displayName]"
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

          <DynamicField
            v-for="field in renderedSchema"
            :key="field.id"
            :field="field"
            v-model="extras[field.field_key]"
          />

          <button type="submit" class="v2-cta" :disabled="loading || !passwordValid">
            <span class="v2-cta__main">
              {{ loading ? 'Creation en cours...' : 'Creer le compte' }}
              <IconChevron v-if="!loading" :size="14" />
            </span>
            <span class="v2-cta__kbd">&#9166; enter</span>
          </button>
        </form>
      </template>
    </div>

    <div class="v2-card__foot">
      <RouterLink to="/login">
        {{ success && isInvite ? 'Se connecter' : 'Deja un compte ? Se connecter' }}
      </RouterLink>
    </div>
  </V2Card>
</template>
