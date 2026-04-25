<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <div class="mb-3.5 inline-flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-accent">
    <span class="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] animate-pulse-dot"></span>
    {{ label }}
  </div>
</template>
