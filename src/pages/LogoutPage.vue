<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import V2Card from '@/components/V2Card.vue'
import { IconCheck, IconChevron } from '@/components/icons'

const route = useRoute()
const redirectUri = ref<string | null>(
  typeof route.query.redirect_uri === 'string' ? route.query.redirect_uri : null,
)

// Front-channel logout: render hidden iframes for each RP logout URI
const frontchannelLogoutUris = computed(() => {
  const uris = route.query.frontchannel_logout_uris
  if (!uris) return []
  if (Array.isArray(uris)) return uris.filter((u): u is string => typeof u === 'string')
  if (typeof uris === 'string') return uris.split(',').filter(Boolean)
  return []
})

// Auto-redirect after a short delay so the user sees the success state
// before being sent back. The manual button remains as a fallback (slow
// network, ad-blockers eating the redirect, JS disabled in fallback paths).
const AUTO_REDIRECT_MS = 1200
let redirectTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (!redirectUri.value) return
  redirectTimer = setTimeout(() => {
    window.location.href = redirectUri.value as string
  }, AUTO_REDIRECT_MS)
})

onBeforeUnmount(() => {
  if (redirectTimer) clearTimeout(redirectTimer)
})
</script>

<template>
  <!-- Hidden iframes for front-channel logout -->
  <iframe
    v-for="uri in frontchannelLogoutUris"
    :key="uri"
    :src="uri"
    style="display: none; width: 0; height: 0; border: 0"
  />

  <V2Card path="auth.orion.io / <b>logout</b>">
    <div class="v2-card__head">
      <div class="success-orb">
        <IconCheck :size="32" :stroke-width="2.5" />
      </div>
      <h1 class="v2-card__title">Deconnexion reussie</h1>
    </div>

    <div class="v2-card__body">
      <p class="text-[13px] leading-[1.55] text-fg-2 text-center">
        <template v-if="redirectUri">Redirection vers l'application&hellip;</template>
        <template v-else>Vous avez ete deconnecte avec succes.</template>
      </p>
    </div>

    <div v-if="redirectUri" class="v2-card__foot">
      <a :href="redirectUri" class="fed-btn w-full no-underline">
        Retour a l'application
        <IconChevron :size="14" />
      </a>
    </div>
  </V2Card>
</template>
