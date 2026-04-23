<script setup lang="ts">
defineProps<{
  label: string
  step?: number
  total?: number
}>()
</script>

<template>
  <div class="auth-step-indicator">
    <span class="step-dot"></span>
    {{ label }}
    <span v-if="step && total" class="step-count">({{ step }}/{{ total }})</span>
  </div>
</template>

<style scoped>
.auth-step-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
  margin-bottom: 14px;
}
.step-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse-dot 2s ease-in-out infinite;
}
.step-count {
  color: var(--fg-3);
}
</style>
