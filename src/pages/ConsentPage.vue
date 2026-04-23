<script setup lang="ts">
import { ref, computed } from 'vue'
import { apiPost } from '../composables/useApi'
import { useAuthState } from '../composables/useAuthState'

const scopeDescriptions: Record<string, string> = {
  openid: 'Vérifier votre identité',
  profile: 'Accéder à votre nom et photo de profil',
  email: 'Voir votre adresse e-mail',
  offline_access: 'Rester connecté en votre nom',
}

const oidcScopes = ['openid', 'profile', 'email', 'offline_access']

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
  }>('/authorize/consent', {
    request_id: state.requestId,
    scopes_granted: uniqueScopes,
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
  <div>
    <h2 class="font-display text-[32px] font-normal tracking-[-0.015em] text-fg-0 mb-0.5">Autorisation requise</h2>
    <p class="font-mono text-[11px] text-fg-2 mb-2">$ auth --consent</p>

    <!-- Resource-based flow -->
    <template v-if="state.resource">
      <p class="text-[13px] text-fg-2 mb-1">
        <strong>{{ state.clientName }}</strong> demande accès à
        <strong>{{ state.resource.name }}</strong>
      </p>
      <p class="font-mono text-[11px] text-fg-2 mb-6">{{ state.resource.identifier }}</p>

      <div class="mb-4 flex flex-col rounded-lg border border-border bg-bg-0 p-3.5">
        <div class="mb-2 font-mono text-[10px] uppercase tracking-[0.06em] text-fg-2">Permissions demandées</div>
        <ul class="m-0 flex list-none flex-col gap-2 p-0">
          <li
            v-for="perm in state.resource.permissions"
            :key="perm.name"
            class="flex flex-col gap-0.5"
          >
            <span class="font-mono text-[13px] text-fg-0">{{ perm.name }}</span>
            <span v-if="perm.description" class="text-xs text-fg-2">{{ perm.description }}</span>
          </li>
        </ul>
      </div>

      <div v-if="oidcRequestedScopes.length > 0" class="mb-4 flex flex-col rounded-lg border border-border bg-bg-0 p-3.5">
        <div class="mb-2 font-mono text-[10px] uppercase tracking-[0.06em] text-fg-2">Informations personnelles</div>
        <ul class="m-0 flex list-none flex-col gap-2 p-0">
          <li
            v-for="scope in oidcRequestedScopes"
            :key="scope"
            class="py-0.5 text-[13px] text-fg-0"
          >
            {{ scopeDescriptions[scope] || scope }}
          </li>
        </ul>
      </div>
    </template>

    <!-- Standard OIDC flow (no resource) -->
    <template v-else>
      <p class="text-[13px] text-fg-2 mb-1">
        <strong>{{ state.clientName }}</strong> souhaite accéder à votre compte.
      </p>

      <ul class="mb-4 flex flex-col rounded-lg border border-border bg-bg-0 p-3.5">
        <li v-for="scope in uniqueScopes" :key="scope" class="py-0.5 text-[13px] text-fg-0">
          {{ scopeDescriptions[scope] || scope }}
        </li>
      </ul>
    </template>

    <Message v-if="error" severity="error" :closable="false" class="mb-2">{{ error }}</Message>

    <div class="flex justify-end gap-3">
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
