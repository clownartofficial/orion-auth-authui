<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="auth-divider">{{ text || 'ou continuer avec' }}</div>
</template>
