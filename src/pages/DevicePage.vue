<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '../composables/useApi'
import V2Card from '@/components/V2Card.vue'
import AuthAlert from '@/components/AuthAlert.vue'
import { IconCheck, IconEye, IconChevron } from '@/components/icons'

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

const cardPath = computed(() => {
  switch (step.value) {
    case 'code': return 'auth.orion.io / <b>device</b>'
    case 'approve': return 'auth.orion.io / <b>approve</b>'
    case 'done': return 'auth.orion.io / <b>done</b>'
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
    if (result.message && result.message !== result.status.toString()) {
      error.value = result.message
    } else if (result.status === 401) {
      error.value = 'Email ou mot de passe incorrect.'
    } else if (result.status === 403) {
      error.value = 'Accès refusé.'
    } else {
      error.value = 'Une erreur est survenue.'
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
  <V2Card :path="cardPath">
    <!-- Step 1: Enter code -->
    <template v-if="step === 'code'">
      <div class="v2-card__head">
        <h1 class="v2-card__title">Activation d'appareil</h1>
        <p class="v2-card__sub">Entrez le code affiche sur votre appareil.</p>
      </div>

      <div class="v2-card__body">
        <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

        <form @submit.prevent="handleVerify">
          <div class="v2-field">
            <label class="v2-field__label">Code</label>
            <div class="v2-input-wrap">
              <input
                v-model="userCode"
                placeholder="XXXX-XXXX"
                required
                autofocus
                class="code-input"
              />
            </div>
          </div>

          <button type="submit" class="v2-cta" :disabled="loading">
            <span class="v2-cta__main">
              {{ loading ? 'Verification...' : 'Verifier' }}
              <IconChevron v-if="!loading" :size="14" />
            </span>
            <span class="v2-cta__kbd">&#9166; enter</span>
          </button>
        </form>
      </div>
    </template>

    <!-- Step 2: Approve/Deny -->
    <template v-if="step === 'approve'">
      <div class="v2-card__head">
        <h1 class="v2-card__title">Autoriser l'appareil</h1>
        <p class="v2-card__sub">
          <strong>{{ clientName }}</strong> souhaite acceder a votre compte.
        </p>
      </div>

      <div class="v2-card__body">
        <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

        <div class="device-card">
          <div class="device-kv" v-for="scope in scopes" :key="scope">
            <span class="device-kv__k">{{ scope }}</span>
            <span class="device-kv__v">{{ scopeDescriptions[scope] || scope }}</span>
          </div>
        </div>

        <form @submit.prevent="handleApprove(true)">
          <div class="v2-field">
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
              <span class="v2-input-wrap__icon"><IconEye :size="15" /></span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••••••"
                required
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

          <button type="submit" class="v2-cta" :disabled="loading">
            <span class="v2-cta__main">
              {{ loading ? 'Autorisation...' : 'Autoriser' }}
              <IconChevron v-if="!loading" :size="14" />
            </span>
            <span class="v2-cta__kbd">&#9166; enter</span>
          </button>

          <button
            type="button"
            class="fed-btn"
            :disabled="loading"
            @click="handleApprove(false)"
          >
            Refuser
          </button>
        </form>
      </div>
    </template>

    <!-- Step 3: Done -->
    <template v-if="step === 'done'">
      <div class="v2-card__head">
        <div class="success-orb">
          <IconCheck :size="32" :stroke-width="2.5" />
        </div>
        <h1 class="v2-card__title">
          {{ resultSeverity === 'success' ? 'Appareil autorise' : 'Autorisation refusee' }}
        </h1>
      </div>

      <div class="v2-card__body">
        <p class="text-[13px] text-fg-2 text-center">{{ resultMessage }}</p>
        <p v-if="resultSeverity === 'success'" class="text-[12px] text-fg-2 text-center mt-4 font-mono">
          Vous pouvez fermer cet onglet.
        </p>
      </div>
    </template>
  </V2Card>
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
