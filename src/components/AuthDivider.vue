<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<template>
  <div class="auth-divider">{{ text || 'or continue with' }}</div>
</template>

<style scoped>
.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0;
  font-family: var(--font-mono);
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--fg-3);
}
.auth-divider::before, .auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-subtle);
}
</style>
