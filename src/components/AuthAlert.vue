<template>
  <div class="alert" :class="severityClass">
    <component :is="icon" :size="14" />
    <div class="alert__body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconInfo, IconAlert as IconWarn, IconCheck } from '@/components/icons'

const props = withDefaults(defineProps<{
  severity?: 'info' | 'warn' | 'danger' | 'success'
}>(), { severity: 'info' })

const severityClass = computed(() => {
  if (props.severity === 'info') return ''
  return `alert--${props.severity}`
})

const icon = computed(() => {
  switch (props.severity) {
    case 'warn': return IconWarn
    case 'danger': return IconWarn
    case 'success': return IconCheck
    default: return IconInfo
  }
})
</script>
