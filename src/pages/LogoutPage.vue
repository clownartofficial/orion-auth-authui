<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
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
</script>

<template>
  <div>
    <!-- Hidden iframes for front-channel logout -->
    <iframe
      v-for="uri in frontchannelLogoutUris"
      :key="uri"
      :src="uri"
      style="display: none; width: 0; height: 0; border: 0"
    />

    <div class="flex flex-col items-center text-center pt-4">
      <div class="success-orb mb-6">
        <IconCheck :size="32" :stroke-width="2.5" />
      </div>

      <h1 class="font-display text-[28px] font-normal leading-[1.15] tracking-[-0.015em] text-fg-0 mb-2">Deconnexion reussie.</h1>
      <p class="text-[13px] leading-[1.55] text-fg-2 mb-7">Vous avez ete deconnecte avec succes.</p>

      <a
        v-if="redirectUri"
        :href="redirectUri"
        class="fed-btn w-full no-underline"
      >
        Retour a l'application
        <IconChevron :size="14" />
      </a>
    </div>
  </div>
</template>
