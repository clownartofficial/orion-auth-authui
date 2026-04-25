<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2"/>
    <path d="M7 4v16M3 12h4"/>
    <path d="M14 9l3 3-3 3M11 12h6"/>
  </svg>
</template>
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
