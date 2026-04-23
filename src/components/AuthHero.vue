<template>
  <div class="auth-hero">
    <!-- Grid overlay -->
    <div class="grid-overlay" aria-hidden="true"></div>

    <!-- Constellation -->
    <svg class="constellation" viewBox="0 0 500 600" aria-hidden="true">
      <circle cx="120" cy="160" r="3" opacity="0.8">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="250" cy="280" r="4">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="380" cy="400" r="3" opacity="0.8">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="370" cy="120" r="2" opacity="0.5">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="420" r="2" opacity="0.5">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4.5s" repeatCount="indefinite" />
      </circle>
      <line x1="120" y1="160" x2="250" y2="280" />
      <line x1="250" y1="280" x2="380" y2="400" />
      <line x1="370" y1="120" x2="250" y2="280" />
      <line x1="250" y1="280" x2="100" y2="420" />
    </svg>

    <div class="hero-brand">
      <div class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 28 28" width="28" height="28">
          <g fill="currentColor">
            <circle cx="8" cy="9" r="1.4" opacity="0.85"/>
            <circle cx="14" cy="14" r="1.8"/>
            <circle cx="20" cy="19" r="1.4" opacity="0.85"/>
            <circle cx="20" cy="6" r="0.9" opacity="0.55"/>
            <circle cx="6" cy="20" r="0.9" opacity="0.55"/>
          </g>
          <g stroke="currentColor" stroke-width="0.6" opacity="0.5" fill="none">
            <path d="M8 9 L14 14 L20 19"/>
            <path d="M20 6 L14 14 L6 20"/>
          </g>
        </svg>
      </div>
      <div class="brand-wordmark">orion<em>auth</em></div>
    </div>

    <div class="hero-quote">
      <h2>Identity infrastructure<br/>built for <em>engineers</em></h2>
      <p>Authentication, authorization, and user management — API-first, self-hosted, fully yours.</p>
    </div>

    <div class="hero-foot">
      <span><span class="dot"></span> SOC 2 Type II</span>
      <span>ISO 27001</span>
      <span>eu-west-3</span>
      <span>99.99% SLA</span>
    </div>
  </div>
</template>

<style scoped>
.auth-hero {
  position: relative;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    radial-gradient(ellipse 900px 600px at 20% 30%, var(--accent-bg), transparent 60%),
    radial-gradient(ellipse 700px 500px at 80% 80%, var(--accent-bg), transparent 70%),
    var(--bg-1);
  border-right: 1px solid var(--border-subtle);
  overflow: hidden;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, var(--border-subtle) 1px, transparent 1px),
    linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 800px 600px at 40% 50%, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 800px 600px at 40% 50%, black 20%, transparent 70%);
  opacity: 0.5;
  pointer-events: none;
}

.constellation {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
.constellation circle { fill: var(--accent); }
.constellation line { stroke: var(--accent); stroke-width: 0.6; opacity: 0.35; }

.hero-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}

.brand-mark {
  width: 28px;
  height: 28px;
  border-radius: var(--r-md);
  background:
    radial-gradient(circle at 30% 30%, var(--accent) 0%, transparent 45%),
    radial-gradient(circle at 70% 70%, var(--accent-lo) 0%, transparent 50%),
    var(--bg-inset);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  color: var(--accent);
}
.brand-mark svg { position: absolute; inset: 0; }

.brand-wordmark {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--fg-0);
}
.brand-wordmark em {
  color: var(--accent);
  font-style: normal;
}

.hero-quote {
  position: relative;
  z-index: 2;
  max-width: 420px;
}
.hero-quote h2 {
  font-family: var(--font-display);
  font-size: 42px;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 16px;
  color: var(--fg-0);
}
.hero-quote h2 em { color: var(--accent); font-style: normal; }
.hero-quote p {
  color: var(--fg-2);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.hero-foot {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--fg-3);
}
.hero-foot span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 8px var(--success);
}
</style>
