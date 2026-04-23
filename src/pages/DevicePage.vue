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
  <div class="page">
    <!-- Step 1: Enter code -->
    <template v-if="step === 'code'">
      <h2 class="page-title">Activation d'appareil</h2>
      <p class="page-sub">$ auth --device</p>
      <p class="page-desc">
        Entrez le code affiché sur votre appareil.
      </p>

      <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

      <form @submit.prevent="handleVerify" class="form">
        <div class="field">
          <label for="user-code">Code</label>
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
      <h2 class="page-title">Autoriser l'appareil</h2>
      <p class="page-sub">$ auth --device --approve</p>
      <p class="page-desc">
        <strong>{{ clientName }}</strong> souhaite accéder à votre compte.
      </p>

      <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

      <ul class="scopes">
        <li v-for="scope in scopes" :key="scope" class="scope-item">
          {{ scopeDescriptions[scope] || scope }}
        </li>
      </ul>

      <form @submit.prevent="handleApprove(true)" class="form">
        <div class="field">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            placeholder="vous@exemple.com"
            required
            fluid
          />
        </div>

        <div class="field">
          <label for="password">Mot de passe</label>
          <Password
            id="password"
            v-model="password"
            :feedback="false"
            toggle-mask
            required
            fluid
          />
        </div>

        <div class="actions">
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
      <h2 class="page-title">Activation d'appareil</h2>
      <p class="page-sub">$ auth --device</p>
      <Message :severity="resultSeverity" :closable="false" class="msg">{{ resultMessage }}</Message>
    </template>
  </div>
</template>

<style scoped>
.page-title {
  text-align: center;
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-bottom: 2px;
}

.page-sub {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-2);
  margin-bottom: 0.5rem;
}

.page-desc {
  text-align: center;
  font-size: 13px;
  color: var(--fg-2);
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--fg-2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.code-input :deep(input) {
  font-family: var(--font-mono);
  font-size: 18px;
  text-align: center;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.scopes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 14px;
  background: var(--bg-0);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.scope-item {
  font-size: 13px;
  color: var(--fg-0);
  padding: 2px 0;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.msg {
  margin-bottom: 0.5rem;
}
</style>
