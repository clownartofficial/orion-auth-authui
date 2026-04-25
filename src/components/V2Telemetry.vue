<script setup lang="ts">
defineProps<{ clientName?: string }>()
</script>

<template>
  <div class="v2-telemetry">
    <div class="v2-telemetry__cell">
      <span class="v2-telemetry__k">region</span>
      <span class="v2-telemetry__v">eu-west-3</span>
    </div>
    <div class="v2-telemetry__cell">
      <span class="v2-telemetry__k">latency</span>
      <span class="v2-telemetry__v">&mdash;</span>
    </div>
    <div class="v2-telemetry__cell">
      <span class="v2-telemetry__k">tenant</span>
      <span class="v2-telemetry__v accent">{{ clientName || 'orionauth' }}</span>
    </div>
    <div class="v2-telemetry__cell">
      <span class="v2-telemetry__k">status</span>
      <span class="v2-telemetry__v"><span class="dot" />operational</span>
    </div>
  </div>
</template>
