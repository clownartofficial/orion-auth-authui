<script setup lang="ts">
import { ref } from 'vue'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'

const { state } = useAuthState()

const grantedScopes = ref<string[]>([...state.requestedScopes])
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
    scopes_granted: grantedScopes.value,
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

    <div class="scopes">
      <div v-for="scope in state.requestedScopes" :key="scope" class="scope-item">
        <Checkbox
          v-model="grantedScopes"
          :input-id="scope"
          :value="scope"
        />
        <label :for="scope">{{ scope }}</label>
      </div>
    </div>

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
  display: flex;
  align-items: center;
  gap: 10px;
}

.scope-item label {
  font-family: var(--nh-mono);
  font-size: 12px;
  color: var(--nh-text);
  cursor: pointer;
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
