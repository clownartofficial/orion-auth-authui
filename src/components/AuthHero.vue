<template>
  <div class="auth-hero relative flex flex-col justify-between overflow-hidden border-r border-border-subtle p-10 md:p-12">
    <div class="grid-overlay" aria-hidden="true"></div>

    <!-- Orion constellation (10 stars, 7 connections) -->
    <svg class="constellation absolute inset-0 z-[1] h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <!-- Connections -->
      <line x1="20" y1="18" x2="32" y2="48" /><!-- Bellatrix->Alnitak -->
      <line x1="36" y1="22" x2="28" y2="52" /><!-- Betelgeuse->Alnilam -->
      <line x1="32" y1="48" x2="28" y2="52" /><!-- Alnitak->Alnilam -->
      <line x1="28" y1="52" x2="24" y2="56" /><!-- Alnilam->Mintaka -->
      <line x1="24" y1="56" x2="18" y2="78" /><!-- Mintaka->Rigel -->
      <line x1="28" y1="52" x2="40" y2="78" /><!-- Alnilam->Saiph -->
      <line x1="20" y1="18" x2="36" y2="22" /><!-- Bellatrix->Betelgeuse -->
      <!-- Stars -->
      <circle cx="20" cy="18" r="0.7" style="animation: twinkle 2s ease-in-out 0s infinite" />
      <circle cx="36" cy="22" r="0.83" style="animation: twinkle 3s ease-in-out 0.3s infinite" />
      <circle cx="32" cy="48" r="0.7" style="animation: twinkle 4s ease-in-out 0.6s infinite" />
      <circle cx="28" cy="52" r="0.73" style="animation: twinkle 2s ease-in-out 0.9s infinite" />
      <circle cx="24" cy="56" r="0.7" style="animation: twinkle 3s ease-in-out 1.2s infinite" />
      <circle cx="18" cy="78" r="0.77" style="animation: twinkle 4s ease-in-out 1.5s infinite" />
      <circle cx="40" cy="78" r="0.7" style="animation: twinkle 2s ease-in-out 1.8s infinite" />
      <circle cx="50" cy="10" r="0.5" style="animation: twinkle 3s ease-in-out 2.1s infinite" />
      <circle cx="10" cy="40" r="0.43" style="animation: twinkle 4s ease-in-out 2.4s infinite" />
      <circle cx="60" cy="65" r="0.47" style="animation: twinkle 2s ease-in-out 2.7s infinite" />
    </svg>

    <div class="relative z-[2] flex items-center gap-2.5">
      <div class="brand-mark relative h-7 w-7 shrink-0 overflow-hidden rounded-md border border-border text-accent">
        <svg viewBox="0 0 28 28" width="28" height="28" class="absolute inset-0">
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
      <div class="font-display text-[19px] font-normal tracking-[-0.01em] text-fg-0">orion<em class="not-italic text-accent">auth</em></div>
    </div>

    <div class="relative z-[2] max-w-[420px]">
      <h2 class="mb-4 font-display text-[42px] font-normal leading-[1.1] tracking-[-0.02em] text-fg-0">Identity,<br/>built for <em class="not-italic text-accent">engineers</em>.</h2>
      <p class="text-sm leading-[1.6] text-fg-2">Single sign-on, passkeys, federated identity and fine-grained access — under a single audit-grade log.</p>
    </div>

    <div class="relative z-[2] flex gap-[18px] font-mono text-[11px] text-fg-3">
      <span class="inline-flex items-center gap-1.5"><span class="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]"></span>SOC 2 · ISO 27001</span>
      <span>eu-west-3 · 99.99% SLA</span>
    </div>
  </div>
</template>

<style scoped>
.auth-hero {
  background:
    radial-gradient(ellipse 900px 600px at 20% 30%, var(--accent-bg), transparent 60%),
    radial-gradient(ellipse 700px 500px at 80% 80%, var(--accent-bg), transparent 70%),
    var(--bg-1);
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

.constellation circle { fill: var(--accent); }
.constellation line { stroke: var(--accent); stroke-width: 0.6; opacity: 0.35; }

.brand-mark {
  background:
    radial-gradient(circle at 30% 30%, var(--accent) 0%, transparent 45%),
    radial-gradient(circle at 70% 70%, var(--accent-lo) 0%, transparent 50%),
    var(--bg-inset);
}
</style>
