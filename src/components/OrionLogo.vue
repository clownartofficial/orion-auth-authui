<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: number
  withGlow?: boolean
}>(), { size: 32, withGlow: false })

const uid = computed(() => 'ol-' + Math.random().toString(36).slice(2, 7))
const gradId = computed(() => `ol-g-${uid.value}`)
const bgGradId = computed(() => `ol-bg-${uid.value}`)
const glowId = computed(() => `ol-glow-${uid.value}`)

const hex = "M50 4 L90 26 Q94 28 94 33 L94 67 Q94 72 90 74 L50 96 Q46 98 42 96 L10 74 Q6 72 6 67 L6 33 Q6 28 10 26 Z"

const stars = [
  { x: 48, y: 14, s: 2.4 }, { x: 72, y: 20, s: 1.6 }, { x: 82, y: 36, s: 2.2 },
  { x: 86, y: 58, s: 1.8 }, { x: 78, y: 78, s: 2.4 }, { x: 58, y: 88, s: 1.6 },
  { x: 40, y: 86, s: 2.0 }, { x: 18, y: 72, s: 1.8 }, { x: 14, y: 52, s: 2.2 },
  { x: 22, y: 30, s: 1.6 }, { x: 32, y: 14, s: 1.4 }, { x: 62, y: 40, s: 1.4 },
]

function spark(cx: number, cy: number, s: number) {
  const r = s
  const k = r * 0.32
  return `M${cx},${cy - r} C${cx + k},${cy - k} ${cx + k},${cy - k} ${cx + r},${cy} C${cx + k},${cy + k} ${cx + k},${cy + k} ${cx},${cy + r} C${cx - k},${cy + k} ${cx - k},${cy + k} ${cx - r},${cy} C${cx - k},${cy - k} ${cx - k},${cy - k} ${cx},${cy - r} Z`
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display: block; overflow: visible">
    <defs>
      <linearGradient :id="gradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent-hi)" />
        <stop offset="100%" stop-color="var(--accent-lo)" />
      </linearGradient>
      <linearGradient :id="bgGradId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--bg-inset)" />
        <stop offset="100%" stop-color="var(--bg-0)" />
      </linearGradient>
      <filter v-if="withGlow" :id="glowId" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <!-- Outer ring -->
    <path :d="hex" fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linejoin="round" opacity="0.85" />
    <!-- Inner fill -->
    <path :d="hex" :fill="`url(#${bgGradId})`" transform="translate(50 50) scale(0.85) translate(-50 -50)" stroke="var(--border)" stroke-width="0.6" />

    <!-- Starfield sparkles -->
    <g fill="var(--accent)" opacity="0.45">
      <path
        v-for="(s, i) in stars"
        :key="i"
        :d="spark(s.x, s.y, s.s)"
        :style="{ animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.25}s infinite` }"
      />
    </g>

    <!-- "O" glyph -->
    <g :filter="withGlow ? `url(#${glowId})` : undefined">
      <path
        d="M50 26 C62 26 70 36 70 50 C70 64 62 74 50 74 C38 74 30 64 30 50 C30 36 38 26 50 26 Z M50 34 C42 34 38 41 38 50 C38 59 42 66 50 66 C58 66 62 59 62 50 C62 41 58 34 50 34 Z"
        :fill="`url(#${gradId})`"
        fill-rule="evenodd"
      />
      <circle cx="50" cy="50" r="2.6" fill="var(--accent-hi)" opacity="0.9" />
    </g>
  </svg>
</template>
