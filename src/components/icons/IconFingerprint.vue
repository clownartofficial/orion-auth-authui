<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 11c-.3 3.6-1.1 7-2.5 10.5"/>
    <path d="M8.5 21.5A14 14 0 0 0 10 12a2 2 0 1 1 4 0c0 2.2-.2 4.3-.6 6.5"/>
    <path d="M17.5 20c.9-3 1.5-6 1.5-8a7 7 0 1 0-14 0c0 1 .1 2 .3 3"/>
    <path d="M5.8 14c.4 2.3.3 4.6-.4 6.9"/>
    <path d="M21.5 13c.3-1 .5-2 .5-3a10 10 0 0 0-17-7"/>
  </svg>
</template>
<script setup lang="ts">
defineProps<{ size?: number }>()
</script>
