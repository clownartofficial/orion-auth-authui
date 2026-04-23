<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="auth-divider my-[22px] flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">{{ text || 'or continue with' }}</div>
</template>

<style scoped>
.auth-divider::before, .auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-subtle);
}
</style>
