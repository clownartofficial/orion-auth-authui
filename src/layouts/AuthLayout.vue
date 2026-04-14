<template>
  <div class="auth-layout">
    <Card class="auth-card">
      <template #content>
        <slot />
      </template>
    </Card>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 2rem;
  background: var(--p-surface-50);
}

.auth-card {
  width: 100%;
  max-width: 28rem;
}
</style>
