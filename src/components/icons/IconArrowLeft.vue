<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
</template>
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
