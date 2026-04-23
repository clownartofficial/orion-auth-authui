<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { apiPost } from '../composables/useApi'

const route = useRoute()

const scopeDescriptions: Record<string, string> = {
  openid: 'Vérifier votre identité',
  profile: 'Accéder à votre nom et photo de profil',
  email: 'Voir votre adresse e-mail',
  offline_access: 'Rester connecté en votre nom',
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
    error.value = result.status === 400 ? 'Code invalide ou expiré.' : result.message
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
      error.value = 'Votre compte est verrouillé. Veuillez contacter le support.'
    } else {
      error.value = result.message
    }
    return
  }

  if (approved) {
    resultMessage.value = 'Appareil autorisé. Vous pouvez fermer cette page.'
    resultSeverity.value = 'success'
  } else {
    resultMessage.value = 'Autorisation refusée.'
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
    <!-- Step 1: Enter code -->
    <template v-if="step === 'code'">
      <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">Activation d'appareil</h2>
      <p class="font-mono text-[11px] text-fg-2 mb-2">$ auth --device</p>
      <p class="text-[13px] text-fg-2 mb-6">
        Entrez le code affiché sur votre appareil.
      </p>

      <Message v-if="error" severity="error" :closable="false" class="mb-2">{{ error }}</Message>

      <form @submit.prevent="handleVerify" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="user-code" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">Code</label>
          <InputText
            id="user-code"
            v-model="userCode"
            placeholder="XXXX-XXXX"
            required
            fluid
            class="code-input"
          />
        </div>

        <Button
          type="submit"
          label="Vérifier"
          :loading="loading"
          fluid
        />
      </form>
    </template>

    <!-- Step 2: Approve/Deny -->
    <template v-if="step === 'approve'">
      <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">Autoriser l'appareil</h2>
      <p class="font-mono text-[11px] text-fg-2 mb-2">$ auth --device --approve</p>
      <p class="text-[13px] text-fg-2 mb-1">
        <strong>{{ clientName }}</strong> souhaite accéder à votre compte.
      </p>

      <Message v-if="error" severity="error" :closable="false" class="mb-2">{{ error }}</Message>

      <ul class="mb-6 flex flex-col gap-3 rounded-lg border border-border bg-bg-0 p-3.5 list-none m-0">
        <li v-for="scope in scopes" :key="scope" class="py-0.5 text-[13px] text-fg-0">
          {{ scopeDescriptions[scope] || scope }}
        </li>
      </ul>

      <form @submit.prevent="handleApprove(true)" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">Email</label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            placeholder="vous@exemple.com"
            required
            fluid
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-2">Mot de passe</label>
          <Password
            id="password"
            v-model="password"
            :feedback="false"
            toggle-mask
            required
            fluid
          />
        </div>

        <div class="flex justify-end gap-3">
          <Button
            label="Refuser"
            severity="secondary"
            outlined
            @click="handleApprove(false)"
            :disabled="loading"
          />
          <Button
            type="submit"
            label="Autoriser"
            :loading="loading"
          />
        </div>
      </form>
    </template>

    <!-- Done -->
    <template v-if="step === 'done'">
      <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">Activation d'appareil</h2>
      <p class="font-mono text-[11px] text-fg-2 mb-2">$ auth --device</p>
      <Message :severity="resultSeverity" :closable="false" class="mb-2">{{ resultMessage }}</Message>
    </template>
  </div>
</template>

<style scoped>
.code-input :deep(input) {
  font-family: var(--font-mono);
  font-size: 18px;
  text-align: center;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
</style>
