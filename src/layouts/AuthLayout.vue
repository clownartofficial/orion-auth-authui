<script setup lang="ts">
import AuthHero from '../components/AuthHero.vue'
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 overflow-hidden bg-bg-0 md:grid-cols-[1fr_520px]">
    <AuthHero />

    <div class="flex min-h-screen flex-col bg-bg-0 px-6 py-8 md:px-14 md:pb-10 md:pt-14">
      <div class="mb-auto flex items-center justify-between">
        <div class="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-inset px-2.5 py-[5px] font-mono text-[11px] text-fg-2">
          <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
          signing in to <strong class="font-medium text-fg-0">OrionAuth</strong>
        </div>
      </div>

      <div class="mx-auto my-10 w-full max-w-[400px] animate-fade-in">
        <slot />
      </div>

      <div class="mt-auto flex items-center justify-between border-t border-border-subtle pt-6 font-mono text-[11px] text-fg-3">
        <span>&copy; 2026 OrionAuth · v1.0.0</span>
        <!-- TODO: Footer links (needs configured URLs)
        <div class="flex gap-[18px]">
          <a href="#" class="text-fg-2 no-underline hover:text-fg-0">Privacy</a>
          <a href="#" class="text-fg-2 no-underline hover:text-fg-0">Terms</a>
          <a href="#" class="text-fg-2 no-underline hover:text-fg-0">Docs</a>
        </div>
        -->
      </div>
    </div>
  </div>
</template>
