<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiPost } from '@/composables/useApi'
import { useAuthState } from '@/composables/useAuthState'
import { performRedirect } from '@/composables/useRedirect'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import { IconArrowLeft } from '@/components/icons'

const router = useRouter()
const { state, updateFromLoginResponse } = useAuthState()

const digits = ref<string[]>(['', '', '', '', '', ''])
const inputs = ref<(HTMLInputElement | null)[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(() => {
  inputs.value[0]?.focus()
})

function setDigit(i: number, value: string) {
  const v = value.replace(/\D/g, '').slice(0, 1)
  const d = [...digits.value]
  d[i] = v
  digits.value = d

  if (v && i < 5) {
    inputs.value[i + 1]?.focus()
  }

  if (d.every(x => x !== '')) {
    setTimeout(handleSubmit, 200)
  }
}

function onKeyDown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    inputs.value[i - 1]?.focus()
  }
}

function onPaste(e: ClipboardEvent) {
  const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  if (text.length) {
    digits.value = text.padEnd(6, '').split('').slice(0, 6)
    if (text.length === 6) {
      setTimeout(handleSubmit, 200)
    }
    e.preventDefault()
  }
}

function clearDigits() {
  digits.value = ['', '', '', '', '', '']
  inputs.value[0]?.focus()
}

async function handleSubmit() {
  const code = digits.value.join('')
  if (code.length !== 6) return

  error.value = null
  loading.value = true

  const result = await apiPost<{
    redirect_uri?: string
    code?: string
    state?: string
    iss?: string
    session_state?: string
    requires_consent?: boolean
    scopes?: string[]
  }>('/authorize/mfa', {
    request_id: state.requestId,
    code,
  })

  loading.value = false

  if (!result.ok) {
    if (result.status === 403) {
      error.value = 'Code invalide. Veuillez reessayer.'
    } else {
      error.value = result.message
    }
    clearDigits()
    return
  }

  const data = result.data

  if (data.redirect_uri && data.code) {
    performRedirect({
      redirect_uri: data.redirect_uri,
      code: data.code,
      state: data.state,
      iss: data.iss,
      session_state: data.session_state,
    }, state.responseMode)
    return
  }

  if (data.requires_consent) {
    updateFromLoginResponse(data)
    router.push('/consent')
  }
}
</script>

<template>
  <V2Card path="auth.orion.io / <b>verify</b>">
    <div class="v2-card__head">
      <h1 class="v2-card__title">Verification</h1>
      <p class="v2-card__sub">Entrez le code a 6 chiffres de votre application d'authentification.</p>
    </div>

    <div class="v2-card__body">
      <button
        type="button"
        class="mb-3 flex items-center gap-1.5 text-sm text-fg-2 hover:text-fg-0 cursor-pointer bg-transparent border-none font-[inherit] p-0"
        @click="router.push('/login')"
      >
        <IconArrowLeft :size="13" /> Retour
      </button>

      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <div class="flex justify-center gap-2 my-2" @paste="onPaste">
        <input
          v-for="(d, i) in digits"
          :key="i"
          :ref="(el) => { inputs[i] = el as HTMLInputElement }"
          class="otp-digit"
          :class="{ 'otp-digit--filled': d }"
          inputmode="numeric"
          maxlength="1"
          :value="d"
          :disabled="loading"
          @input="setDigit(i, ($event.target as HTMLInputElement).value)"
          @keydown="onKeyDown(i, $event)"
        />
      </div>
    </div>

    <div class="v2-card__foot">
      <RouterLink to="/forgot-password">Probleme de connexion ?</RouterLink>
    </div>
  </V2Card>
</template>
