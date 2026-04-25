<script setup lang="ts">
import { computed } from 'vue'
import AuthHero from '../components/AuthHero.vue'
import { useAuthState } from '@/composables/useAuthState'

const { state } = useAuthState()
const clientName = computed(() => state.clientName || 'OrionAuth')
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 overflow-hidden bg-bg-0 md:grid-cols-[1fr_520px]">
    <AuthHero class="hidden md:flex" />

    <div class="flex min-h-screen flex-col bg-bg-0 px-6 py-8 md:px-14 md:pb-10 md:pt-14">
      <div class="mb-auto flex items-center justify-between">
        <div class="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-inset px-2.5 py-[5px] font-mono text-[11px] text-fg-2">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
          connexion a <strong class="font-medium text-fg-0">{{ clientName }}</strong>
        </div>
      </div>

      <div class="mx-auto my-10 w-full max-w-[400px] animate-fade-in">
        <slot />
      </div>

      <div class="mt-auto flex items-center justify-between border-t border-border-subtle pt-6 font-mono text-[11px] text-fg-3">
        <span>&copy; 2026 OrionAuth</span>
        <div class="flex gap-[18px]">
          <a href="#" class="text-fg-2 no-underline hover:text-fg-0">Confidentialite</a>
          <a href="#" class="text-fg-2 no-underline hover:text-fg-0">Conditions</a>
        </div>
      </div>
    </div>
  </div>
</template>
