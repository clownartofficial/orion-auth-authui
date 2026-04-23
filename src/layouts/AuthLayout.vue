<script setup lang="ts">
import AuthHero from '../components/AuthHero.vue'
</script>

<template>
  <div class="auth-shell">
    <AuthHero />

    <div class="auth-panel">
      <div class="auth-panel-top">
        <div class="tenant-badge">
          <span class="tenant-dot"></span>
        signing in to <strong>OrionAuth</strong>
        </div>
      </div>

      <div class="auth-card">
        <slot />
      </div>

      <div class="auth-panel-bottom">
        <span>&copy; 2026 OrionAuth · v1.0.0</span>
        <div class="auth-panel-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Docs</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 520px;
  background: var(--bg-0);
  position: relative;
  overflow: hidden;
}

.auth-panel {
  padding: 56px 56px 40px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-0);
}

.auth-panel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: auto;
}

.tenant-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: var(--r-full);
  background: var(--bg-inset);
  border: 1px solid var(--border-subtle);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-2);
}
.tenant-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
.tenant-badge strong {
  color: var(--fg-0);
  font-weight: 500;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  margin: 40px auto;
  animation: fade-in 320ms cubic-bezier(0.2, 0, 0, 1);
}

.auth-panel-bottom {
  margin-top: auto;
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-3);
  border-top: 1px solid var(--border-subtle);
}

.auth-panel-links {
  display: flex;
  gap: 18px;
}
.auth-panel-links a {
  color: var(--fg-2);
  text-decoration: none;
}
.auth-panel-links a:hover {
  color: var(--fg-0);
}

@media (max-width: 900px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }
  .auth-panel {
    padding: 32px 24px;
  }
}
</style>
