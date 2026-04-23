<script setup lang="ts">
defineProps<{
  label: string
  step?: number
  total?: number
}>()
</script>

<template>
  <div class="mb-3.5 inline-flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-accent">
    <span class="step-dot h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] animate-pulse-dot"></span>
    {{ label }}
    <span v-if="step && total" class="text-fg-3">({{ step }}/{{ total }})</span>
  </div>
</template>
