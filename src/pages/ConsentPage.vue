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
  <div class="page">
    <h2 class="page-title">Autorisation requise</h2>
    <p class="page-sub">$ auth --consent</p>

    <!-- Resource-based flow -->
    <template v-if="state.resource">
      <p class="page-desc">
        <strong>{{ state.clientName }}</strong> demande accès à
        <strong>{{ state.resource.name }}</strong>
      </p>
      <p class="resource-id">{{ state.resource.identifier }}</p>

      <div class="scopes">
        <div class="section-label">Permissions demandées</div>
        <ul class="permission-list">
          <li
            v-for="perm in state.resource.permissions"
            :key="perm.name"
            class="permission-item"
          >
            <span class="perm-name">{{ perm.name }}</span>
            <span v-if="perm.description" class="perm-desc">{{ perm.description }}</span>
          </li>
        </ul>
      </div>

      <div v-if="oidcRequestedScopes.length > 0" class="scopes">
        <div class="section-label">Informations personnelles</div>
        <ul class="permission-list">
          <li
            v-for="scope in oidcRequestedScopes"
            :key="scope"
            class="scope-item"
          >
            {{ scopeDescriptions[scope] || scope }}
          </li>
        </ul>
      </div>
    </template>

    <!-- Standard OIDC flow (no resource) -->
    <template v-else>
      <p class="page-desc">
        <strong>{{ state.clientName }}</strong> souhaite accéder à votre compte.
      </p>

      <ul class="scopes">
        <li v-for="scope in uniqueScopes" :key="scope" class="scope-item">
          {{ scopeDescriptions[scope] || scope }}
        </li>
      </ul>
    </template>

    <Message v-if="error" severity="error" :closable="false" class="msg">{{ error }}</Message>

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
  margin-bottom: 0.25rem;
}

.resource-id {
  text-align: center;
  font-family: var(--nh-mono);
  font-size: 11px;
  color: var(--nh-muted);
  margin-bottom: 1.5rem;
}

.section-label {
  font-family: var(--nh-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--nh-muted);
  margin-bottom: 0.5rem;
}

.scopes {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  padding: 14px;
  background: var(--nh-bg);
  border: 1px solid var(--nh-border);
  border-radius: 8px;
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.permission-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.perm-name {
  font-family: var(--nh-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--nh-text);
}

.perm-desc {
  font-size: 12px;
  color: var(--nh-muted);
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
