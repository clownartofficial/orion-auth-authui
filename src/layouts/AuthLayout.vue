<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-logo">
        <div class="logo-dot"></div>
        <span>Orion</span>
      </div>
      <Card class="auth-card">
        <template #content>
          <slot />
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 2rem;
  background: var(--nh-bg);
}

.auth-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  font-family: var(--nh-mono);
  font-size: 20px;
  font-weight: 600;
  color: var(--nh-text);
  letter-spacing: -0.02em;
}

.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--nh-accent);
  animation: pulse 2.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.auth-card {
  width: 100%;
}

</style>
