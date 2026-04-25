<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import V2Stars from '@/components/V2Stars.vue'
import logoDark from '@/assets/logo-dark.svg'
import logoLight from '@/assets/logo-light.svg'

const { theme, mode, cycle } = useTheme()
const logoSrc = computed(() => theme.value === 'dark' ? logoDark : logoLight)

const themeIcon = computed(() => {
  if (mode.value === 'auto') return '&#9788;' // auto/system
  if (mode.value === 'dark') return '&#9790;'  // moon
  return '&#9728;'                              // sun
})

const themeLabel = computed(() => {
  if (mode.value === 'auto') return 'Auto'
  if (mode.value === 'dark') return 'Sombre'
  return 'Clair'
})
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
      <div class="v2__topbar-right">
        <button
          class="v2__chip"
          @click="cycle"
          :title="`Theme : ${themeLabel}`"
        >
          <span v-html="themeIcon" />
          {{ themeLabel }}
        </button>
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
      <span>&copy; 2026 OrionAuth</span>
      <div class="v2__foot__links">
        <a href="#">Confidentialite</a>
        <a href="#">Conditions</a>
      </div>
    </footer>
  </div>
</template>
