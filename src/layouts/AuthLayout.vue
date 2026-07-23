<script setup lang="ts">
import ClownLogo from '@/components/icons/ClownLogo.vue'
</script>

<template>
  <div class="v2">
    <div class="v2__bg" />

    <!-- Top bar -->
    <header class="v2__top">
      <div class="v2__brand">
        <ClownLogo class="h-8" />
      </div>
      <div class="v2__topbar-right">
        <a href="https://www.clown.art" target="_blank" rel="noopener noreferrer">clown.art &rarr;</a>
      </div>
    </header>

    <!-- Stage -->
    <main class="v2__stage">
      <div style="width: 100%; max-width: 460px; display: flex; flex-direction: column; align-items: center">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="v2__foot">
      <span>&copy; 2026 CLOWN.ART</span>
      <div class="v2__foot__links">
        <a href="https://www.clown.art/pages/politique-de-confidentialite-privacy-policy" target="_blank" rel="noopener noreferrer">Confidentialite</a>
        <a href="#">Conditions</a>
      </div>
    </footer>
  </div>
</template>
