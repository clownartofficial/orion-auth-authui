<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '../composables/useApi'
import FlowStepIndicator from '@/components/FlowStepIndicator.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import { IconCheck, IconEye } from '@/components/icons'

const route = useRoute()

const scopeDescriptions: Record<string, string> = {
  openid: 'Verifier votre identite',
  profile: 'Acceder a votre nom et photo de profil',
  email: 'Voir votre adresse e-mail',
  offline_access: 'Rester connecte en votre nom',
}

const step = ref<'code' | 'approve' | 'done'>('code')
const userCode = ref('')
const clientName = ref('')
const scopes = ref<string[]>([])
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const resultMessage = ref('')
const resultSeverity = ref<'success' | 'info'>('success')
const showPassword = ref(false)

const stepLabel = computed(() => {
  switch (step.value) {
    case 'code': return 'code'
    case 'approve': return 'approbation'
    case 'done': return 'termine'
  }
})

async function handleVerify() {
  error.value = null
  loading.value = true

  const result = await apiPost<{
    user_code: string
    client_name: string
    scopes: string[]
  }>('/device/verify', {
    user_code: userCode.value,
  })

  loading.value = false

  if (!result.ok) {
    error.value = result.status === 400 ? 'Code invalide ou expire.' : result.message
    return
  }

  clientName.value = result.data.client_name
  scopes.value = result.data.scopes
  step.value = 'approve'
}

async function handleApprove(approved: boolean) {
  error.value = null

  if (approved && (!email.value || !password.value)) {
    error.value = 'Veuillez renseigner votre email et mot de passe.'
    return
  }

  loading.value = true

  const result = await apiPost<{ message: string }>('/device/approve', {
    user_code: userCode.value,
    approved,
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (!result.ok) {
    if (result.status === 401) {
      error.value = 'Email ou mot de passe incorrect.'
    } else if (result.status === 403) {
      error.value = 'Votre compte est verrouille. Veuillez contacter le support.'
    } else {
      error.value = result.message
    }
    return
  }

  if (approved) {
    resultMessage.value = 'Appareil autorise. Vous pouvez fermer cette page.'
    resultSeverity.value = 'success'
  } else {
    resultMessage.value = 'Autorisation refusee.'
    resultSeverity.value = 'info'
  }
  step.value = 'done'
}

onMounted(() => {
  const code = route.query.code
  if (typeof code === 'string' && code.length > 0) {
    userCode.value = code
    handleVerify()
  }
})
</script>

<template>
  <div>
    <FlowStepIndicator :label="stepLabel" />

    <!-- Step 1: Enter code -->
    <template v-if="step === 'code'">
      <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">Activation d'appareil</h2>
      <p class="font-mono text-[11px] text-fg-2 mb-6">
        Entrez le code affiche sur votre appareil.
      </p>

      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <form @submit.prevent="handleVerify" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="user-code" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">Code</label>
          <input
            id="user-code"
            v-model="userCode"
            placeholder="XXXX-XXXX"
            required
            class="input code-input"
          />
        </div>

        <button type="submit" class="auth-btn" :disabled="loading">
          {{ loading ? 'Verification...' : 'Verifier' }}
        </button>
      </form>
    </template>

    <!-- Step 2: Approve/Deny -->
    <template v-if="step === 'approve'">
      <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">Autoriser l'appareil</h2>
      <p class="text-[13px] text-fg-2 mb-1">
        <strong class="text-fg-0">{{ clientName }}</strong> souhaite acceder a votre compte.
      </p>

      <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

      <div class="device-card">
        <div class="device-kv" v-for="scope in scopes" :key="scope">
          <span class="device-kv__k">{{ scope }}</span>
          <span class="device-kv__v">{{ scopeDescriptions[scope] || scope }}</span>
        </div>
      </div>

      <form @submit.prevent="handleApprove(true)" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="vous@exemple.com"
            required
            class="input"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">Mot de passe</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="input pr-10"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-fg-2 hover:text-fg-0 transition-colors bg-transparent border-none cursor-pointer p-0"
              @click="showPassword = !showPassword"
            >
              <IconEye :size="16" :off="showPassword" />
            </button>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            class="fed-btn flex-1"
            :disabled="loading"
            @click="handleApprove(false)"
          >
            Refuser
          </button>
          <button type="submit" class="auth-btn flex-1" :disabled="loading">
            {{ loading ? 'Autorisation...' : 'Autoriser' }}
          </button>
        </div>
      </form>
    </template>

    <!-- Done -->
    <template v-if="step === 'done'">
      <div class="flex flex-col items-center text-center pt-4">
        <div class="success-orb mb-6">
          <IconCheck :size="32" :stroke-width="2.5" />
        </div>

        <h2 class="font-display text-[28px] font-normal tracking-[-0.015em] text-fg-0 mb-2">
          {{ resultSeverity === 'success' ? 'Appareil autorise' : 'Autorisation refusee' }}
        </h2>
        <p class="text-[13px] text-fg-2">{{ resultMessage }}</p>
        <p v-if="resultSeverity === 'success'" class="text-[12px] text-fg-2 mt-4 font-mono">
          Vous pouvez fermer cet onglet.
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.code-input {
  font-family: var(--font-mono);
  font-size: 18px;
  text-align: center;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>
