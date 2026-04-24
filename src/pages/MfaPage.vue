<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'
import { performRedirect } from '../composables/useRedirect'
import FlowStepIndicator from '../components/FlowStepIndicator.vue'

const router = useRouter()
const { state, updateFromLoginResponse } = useAuthState()

const code = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

watch(code, (val) => {
  if (val.length === 6) {
    handleSubmit()
  }
})

async function handleSubmit() {
  error.value = null
  loading.value = true

  const result = await apiPost<{
    redirect_uri?: string
    code?: string
    state?: string
    requires_consent?: boolean
    scopes?: string[]
  }>('/authorize/mfa', {
    request_id: state.requestId,
    code: code.value,
  })

  loading.value = false

  if (!result.ok) {
    if (result.status === 403) {
      error.value = 'Code invalide. Veuillez réessayer.'
    } else {
      error.value = result.message
    }
    code.value = ''
    return
  }

  const data = result.data

  if (data.redirect_uri && data.code) {
    performRedirect(data, state.responseMode)
    return
  }

  if (data.requires_consent) {
    updateFromLoginResponse(data)
    router.push('/consent')
  }
}
</script>

<template>
  <div>
    <button class="mb-3 inline-flex items-center gap-1.5 rounded-md border-none bg-transparent px-2 py-1 font-[inherit] text-[13px] text-fg-1 cursor-pointer transition-all duration-fast hover:bg-bg-2 hover:text-fg-0" @click="router.back()">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      Retour
    </button>

    <FlowStepIndicator label="vérification" :step="2" :total="3" />
    <h1 class="font-display text-[32px] font-normal leading-[1.15] tracking-[-0.015em] text-fg-0 mb-2">Entrez le code.</h1>
    <p class="text-[13.5px] leading-[1.55] text-fg-2 mb-7">Entrez le code à 6 chiffres de votre application d'authentification.</p>

    <Message v-if="error" severity="error" :closable="false" class="mb-2">{{ error }}</Message>

    <div class="flex justify-center mb-2">
      <InputOtp v-model="code" :length="6" integer-only :disabled="loading" />
    </div>

    <!-- TODO: OTP countdown timer (needs backend expiry info)
    <div class="mt-4 text-center font-mono text-[11px] text-fg-3">
      code expires in <span class="text-fg-0">04:59</span>
    </div>
    -->

    <!-- TODO: Resend code (needs backend endpoint)
    <div class="mt-6 text-center text-[12.5px] text-fg-2">
      Vous n'avez pas reçu le code ? <a href="#" class="text-accent no-underline font-medium hover:underline">Renvoyer</a>
    </div>
    -->
  </div>
</template>
