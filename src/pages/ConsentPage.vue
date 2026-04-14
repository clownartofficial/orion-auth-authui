<script setup lang="ts">
import { ref } from 'vue'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'

const scopeDescriptions: Record<string, string> = {
  openid: 'Vérifier votre identité',
  profile: 'Accéder à votre nom et photo de profil',
  email: 'Voir votre adresse e-mail',
  offline_access: 'Rester connecté en votre nom',
}

const { state } = useAuthState()

const loading = ref(false)
const error = ref<string | null>(null)

async function handleApprove() {
  error.value = null
  loading.value = true

  const result = await apiPost<{
    redirect_uri: string
    code: string
    state?: string
  }>('/authorize/consent', {
    request_id: state.requestId,
    scopes_granted: state.requestedScopes,
  })

  loading.value = false

  if (!result.ok) {
    error.value = result.message
    return
  }

  const data = result.data
  const url = new URL(data.redirect_uri)
  url.searchParams.set('code', data.code)
  if (data.state) url.searchParams.set('state', data.state)
  window.location.href = url.toString()
}

function handleDeny() {
  window.history.back()
}
</script>

<template>
  <div class="page">
    <h2 class="page-title">Autorisation requise</h2>
    <p class="page-sub">$ auth --consent</p>
    <p class="page-desc">
      <strong>{{ state.clientName }}</strong> souhaite accéder à votre compte.
    </p>

    <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

    <ul class="scopes">
      <li v-for="scope in state.requestedScopes" :key="scope" class="scope-item">
        {{ scopeDescriptions[scope] || scope }}
      </li>
    </ul>

    <div class="actions">
      <Button
        label="Refuser"
        severity="secondary"
        outlined
        @click="handleDeny"
        :disabled="loading"
      />
      <Button
        label="Autoriser"
        :loading="loading"
        @click="handleApprove"
      />
    </div>
  </div>
</template>

<style scoped>
.page-title {
  text-align: center;
  font-family: var(--nh-sans);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.03em;
  margin-bottom: 2px;
}

.page-sub {
  text-align: center;
  font-family: var(--nh-mono);
  font-size: 11px;
  color: var(--nh-muted);
  margin-bottom: 0.5rem;
}

.page-desc {
  text-align: center;
  font-size: 13px;
  color: var(--nh-muted);
  margin-bottom: 1.5rem;
}

.scopes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 14px;
  background: var(--nh-bg);
  border: 1px solid var(--nh-border);
  border-radius: 8px;
}

.scope-item {
  font-size: 13px;
  color: var(--nh-text);
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
