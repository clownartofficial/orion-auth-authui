<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const redirectUri = ref<string | null>(
  typeof route.query.redirect_uri === 'string' ? route.query.redirect_uri : null,
)
</script>

<template>
  <div>
    <h1 class="font-display text-[32px] font-normal leading-[1.15] tracking-[-0.015em] text-fg-0 mb-2">Session terminee.</h1>
    <p class="text-[13.5px] leading-[1.55] text-fg-2 mb-7">Vous avez ete deconnecte avec succes.</p>

    <a
      v-if="redirectUri"
      :href="redirectUri"
      class="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-md border-none bg-accent px-3.5 py-3 font-[inherit] text-sm font-semibold text-fg-0 cursor-pointer transition-all duration-fast hover:-translate-y-px hover:bg-accent-hi hover:shadow-[0_8px_20px_-8px_var(--accent)] no-underline"
    >
      Retour a l'application
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </a>
  </div>
</template>
