<script setup lang="ts">
import OrionLogo from '@/components/OrionLogo.vue'
import V2Stars from '@/components/V2Stars.vue'
</script>

<template>
  <div class="v2">
    <div class="v2__bg" />
    <V2Stars />

    <!-- Top bar -->
    <header class="v2__top">
      <div class="v2__brand">
        <OrionLogo :size="28" />
        <span class="brand-wordmark">orion<em>auth</em></span>
      </div>
      <div class="v2__topbar-right" />
    </header>

    <!-- Stage -->
    <main class="v2__stage">
      <div style="width: 100%; max-width: 460px; display: flex; flex-direction: column; align-items: center">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="v2__foot">
      <span>&copy; 2026 OrionAuth</span>
      <div class="v2__foot__links">
        <a href="#">Confidentialite</a>
        <a href="#">Conditions</a>
      </div>
    </footer>
  </div>
</template>
