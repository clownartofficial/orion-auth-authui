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
  // Redirect back with error=access_denied if we have info
  // In practice, the backend might handle this via a deny endpoint
  window.history.back()
}
</script>

<template>
  <div class="consent-page">
    <h2>Autorisation requise</h2>
    <p class="subtitle">
      <strong>{{ state.clientName }}</strong> souhaite accéder à votre compte.
    </p>

    <Message v-if="error" severity="error" :closable="false" class="mb-3">{{ error }}</Message>

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
.consent-page h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.scopes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.scope-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.scope-item label {
  font-size: 0.875rem;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.mb-3 {
  margin-bottom: 0.75rem;
}
</style>
