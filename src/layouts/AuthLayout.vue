<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import V2Stars from '@/components/V2Stars.vue'
import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'

const { theme } = useTheme()
const logoSrc = computed(() => theme.value === 'dark' ? logoDark : logoLight)
</script>

<template>
  <div class="v2">
    <div class="v2__bg" />
    <V2Stars />

    <!-- Top bar -->
    <header class="v2__top">
      <div class="v2__brand">
        <img :src="logoSrc" alt="OrionAuth" class="h-7 w-7" />
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
