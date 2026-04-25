<template>
  <div class="flex items-center gap-1.5 mb-6 font-mono text-[10.5px] uppercase tracking-[0.1em] text-fg-3">
    <template v-for="n in total" :key="n">
      <span v-if="n > 1" class="text-fg-3">&middot;</span>
      <span class="inline-flex items-center gap-1.5" :class="stepClass(n)">
        <span
          class="w-1.5 h-1.5 rounded-full"
          :class="dotClass(n)"
        />
        etape {{ n }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ current: number; total: number }>()

function stepClass(n: number) {
  if (n < props.current) return 'text-success'
  if (n === props.current) return 'text-fg-0'
  return ''
}

function dotClass(n: number) {
  if (n < props.current) return 'bg-success'
  if (n === props.current) return 'bg-accent shadow-[0_0_8px_var(--accent)]'
  return 'bg-border-strong'
}
</script>
