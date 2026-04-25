<script setup lang="ts">
withDefaults(defineProps<{
  path?: string
}>(), { path: 'auth.orion.io / <b>signin</b>' })
</script>

<template>
  <article class="v2-card">
    <div class="v2-card__chrome">
      <div class="v2-card__chrome-dots">
        <span /><span /><span />
      </div>
      <div class="v2-card__chrome-path" v-html="path" />
      <div class="v2-card__chrome-meta">
        <span class="dot" />
      </div>
    </div>
    <slot />
  </article>
</template>
