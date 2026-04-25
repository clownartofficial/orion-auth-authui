<script setup lang="ts">
const stars = Array.from({ length: 28 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  d: 2 + Math.random() * 3,
  delay: Math.random() * 3,
  s: 0.6 + Math.random() * 1.2,
}))
</script>

<template>
  <div class="v2-stars" aria-hidden="true">
    <span
      v-for="(s, i) in stars"
      :key="i"
      :style="{
        left: s.x + '%',
        top: s.y + '%',
        width: s.s + 'px',
        height: s.s + 'px',
        animationDuration: s.d + 's',
        animationDelay: s.delay + 's',
      }"
    />
  </div>
</template>
