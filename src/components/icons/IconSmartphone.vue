<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <rect x="6" y="2" width="12" height="20" rx="2"/>
    <path d="M12 18h.01"/>
  </svg>
</template>
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
