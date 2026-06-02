<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '@/composables/useApi'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'

// This page is only reached as a fallback. The standard happy path is the
// backend's GET /api/v1/auth/verify-email returning a 302 directly to the
// originating SPA — the browser follows it and never lands here. The page
// shows up in two cases:
//   - /verify-email/success → success without auto-login (no OAuth context)
//   - /verify-email?error=… → token invalid/expired; offer a resend
const route = useRoute()

const errorCode = computed(() => (route.query.error as string) || '')
const isSuccess = computed(() => route.path.endsWith('/verify-email/success'))

const resendEmail = ref('')
const resendLoading = ref(false)
const resendDone = ref(false)

async function resend() {
  if (!resendEmail.value || resendLoading.value) return
  resendLoading.value = true
  await apiPost('/api/v1/auth/resend-verification', { email: resendEmail.value })
  resendLoading.value = false
  resendDone.value = true
}

const errorMessage = computed(() => {
  switch (errorCode.value) {
    case 'invalid_token':
      return 'Ce lien de verification est invalide ou a expire.'
    case 'missing_token':
      return 'Le lien est incomplet.'
    default:
      return 'Une erreur est survenue lors de la verification.'
  }
})
</script>

<template>
  <V2Card path="auth.orion.io / <b>verify-email</b>">
    <div class="v2-card__head">
      <h1 class="v2-card__title">
        {{ isSuccess ? 'Email verifie' : 'Verification de votre email' }}
      </h1>
      <p class="v2-card__sub">
        {{ isSuccess
          ? 'Votre adresse a ete confirmee.'
          : 'Resultat de la tentative de verification.' }}
      </p>
    </div>

    <div class="v2-card__body">
      <template v-if="isSuccess">
        <AuthAlert severity="success">
          Votre email a ete verifie avec succes. Vous pouvez maintenant vous connecter.
        </AuthAlert>
      </template>

      <template v-else-if="errorCode">
        <AuthAlert severity="danger">{{ errorMessage }}</AuthAlert>

        <div style="margin-top: 16px">
          <p class="text-[12px] text-fg-2" style="margin-bottom: 8px">
            Renvoyer un nouveau lien :
          </p>
          <div class="v2-field">
            <div class="v2-input-wrap">
              <input
                v-model="resendEmail"
                type="email"
                placeholder="vous@exemple.com"
                :disabled="resendDone"
              />
            </div>
          </div>
          <button
            type="button"
            class="v2-cta v2-cta--ghost"
            :disabled="!resendEmail || resendLoading || resendDone"
            @click="resend"
          >
            <span class="v2-cta__main">
              {{ resendDone ? 'Lien envoye' : (resendLoading ? 'Envoi...' : 'Renvoyer le lien') }}
            </span>
          </button>
          <p v-if="resendDone" class="text-[12px] text-fg-2" style="margin-top: 8px">
            Si cette adresse correspond a un compte non verifie, un nouveau
            lien a ete envoye. Pensez a verifier vos spams.
          </p>
        </div>
      </template>

      <template v-else>
        <AuthAlert severity="info">
          Ouvrez le lien recu par email pour verifier votre compte.
        </AuthAlert>
      </template>
    </div>

    <div class="v2-card__foot">
      <RouterLink to="/login">Se connecter</RouterLink>
    </div>
  </V2Card>
</template>
