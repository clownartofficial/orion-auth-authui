<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { Toaster as Sonner } from "vue-sonner"
import { cn } from "@/lib/utils"

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--bg-2)',
      '--normal-text': 'var(--fg-0)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--r-md)',
    }"
    v-bind="props"
  />
</template>
