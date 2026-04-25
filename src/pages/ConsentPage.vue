<script setup lang="ts">
import { ref, computed } from 'vue'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'
import { performRedirect } from '../composables/useRedirect'
import AuthSteps from '@/components/AuthSteps.vue'
import FlowStepIndicator from '@/components/FlowStepIndicator.vue'
import AuthAlert from '@/components/AuthAlert.vue'

const scopeDescriptions: Record<string, string> = {
  openid: 'Vérifier votre identité',
  profile: 'Accéder à votre nom et photo de profil',
  email: 'Voir votre adresse e-mail',
  phone: 'Voir votre numéro de téléphone',
  address: 'Voir votre adresse postale',
  offline_access: 'Rester connecté en votre nom',
}

const oidcScopes = ['openid', 'profile', 'email', 'phone', 'address', 'offline_access']

const { state } = useAuthState()

const uniqueScopes = [...new Set(state.requestedScopes)]

const oidcRequestedScopes = computed(() =>
  uniqueScopes.filter((s) => oidcScopes.includes(s))
)

const loading = ref(false)
const error = ref<string | null>(null)

async function handleApprove() {
  error.value = null
  loading.value = true

  const result = await apiPost<{
    redirect_uri: string
    code: string
    state?: string
    response_mode?: string
  }>('/authorize/consent', {
    request_id: state.requestId,
    scopes_granted: uniqueScopes,
  })

  loading.value = false

  if (!result.ok) {
    error.value = result.message
    return
  }

  performRedirect(result.data, result.data.response_mode || state.responseMode)
}

function handleDeny() {
  window.history.back()
}
</script>

<template>
  <div>
    <AuthSteps :current="3" :total="3" />
    <FlowStepIndicator label="autorisation" />

    <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">
      Autoriser l'acces.
    </h2>
    <p class="text-[13px] text-fg-2 mb-6">
      <strong>{{ state.clientName }}</strong> demande l'acces a votre compte.
    </p>

    <!-- Resource-based flow -->
    <template v-if="state.resource">
      <div class="device-card">
        <div class="mb-2 font-mono text-[10px] uppercase tracking-[0.06em] text-fg-2">
          Ressource
        </div>
        <div class="device-kv">
          <span class="device-kv__k">nom</span>
          <span class="device-kv__v">{{ state.resource.name }}</span>
        </div>
        <div class="device-kv">
          <span class="device-kv__k">identifiant</span>
          <span class="device-kv__v device-kv__v--accent">{{ state.resource.identifier }}</span>
        </div>
      </div>

      <div class="device-card">
        <div class="mb-2 font-mono text-[10px] uppercase tracking-[0.06em] text-fg-2">
          Permissions demandees
        </div>
        <div
          v-for="perm in state.resource.permissions"
          :key="perm.name"
          class="device-kv"
        >
          <span class="device-kv__k">{{ perm.name }}</span>
          <span class="device-kv__v">{{ perm.description || '—' }}</span>
        </div>
      </div>

      <div v-if="oidcRequestedScopes.length > 0" class="device-card">
        <div class="mb-2 font-mono text-[10px] uppercase tracking-[0.06em] text-fg-2">
          Informations personnelles
        </div>
        <div
          v-for="scope in oidcRequestedScopes"
          :key="scope"
          class="device-kv"
        >
          <span class="device-kv__k">{{ scope }}</span>
          <span class="device-kv__v">{{ scopeDescriptions[scope] || scope }}</span>
        </div>
      </div>
    </template>

    <!-- Standard OIDC flow (no resource) -->
    <template v-else>
      <div class="device-card">
        <div class="mb-2 font-mono text-[10px] uppercase tracking-[0.06em] text-fg-2">
          Informations demandees
        </div>
        <div
          v-for="scope in uniqueScopes"
          :key="scope"
          class="device-kv"
        >
          <span class="device-kv__k">{{ scope }}</span>
          <span class="device-kv__v">{{ scopeDescriptions[scope] || scope }}</span>
        </div>
      </div>
    </template>

    <AuthAlert v-if="error" severity="danger">{{ error }}</AuthAlert>

    <div class="flex flex-col gap-3 mt-6">
      <button
        class="auth-btn"
        :disabled="loading"
        @click="handleApprove"
      >
        <template v-if="loading">Autorisation en cours...</template>
        <template v-else>Autoriser</template>
      </button>
      <button
        class="fed-btn text-danger"
        :disabled="loading"
        @click="handleDeny"
      >
        Refuser
      </button>
    </div>
  </div>
</template>
