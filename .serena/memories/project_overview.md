# OrionAuth Auth UI - Project Overview

## Purpose
User-facing OAuth2/OIDC authorization UI. Handles login, MFA, consent, device flow, registration, and password management. Separate from the admin panel (orion-auth-frontend).

## Tech Stack
- **Framework:** Vue 3 (Composition API with `<script setup>`)
- **Language:** TypeScript 6.0.2
- **Build Tool:** Vite 8.0.4
- **UI Library:** PrimeVue 4.5.5 (auto-imported via unplugin-vue-components + PrimeVueResolver)
- **Theme:** @primeuix/themes (Aura preset) + custom NHPro dark theme CSS variables
- **Routing:** Vue Router 5.0.4 (base path /ui/)
- **Deployment:** Docker multi-stage (Node 22 Alpine → Nginx Alpine)

## Project Structure
```
src/
├── composables/
│   ├── useAuthState.ts     # Reactive OAuth flow state (request_id, client_name, scopes, etc.)
│   ├── useApi.ts           # Fetch wrapper with ApiResult<T> for /authorize and /device endpoints
│   └── useSettings.ts      # Fetches /api/v1/auth/settings (registration_enabled)
├── layouts/
│   └── AuthLayout.vue      # Card-centered layout with Orion logo
├── pages/
│   ├── AuthorizePage.vue   # OAuth2 entry point (GET /authorize with params)
│   ├── LoginPage.vue       # Email/password login (POST /authorize/login)
│   ├── MfaPage.vue         # 6-digit TOTP verification (POST /authorize/mfa)
│   ├── ConsentPage.vue     # Scope consent screen (POST /authorize/consent)
│   ├── RegisterPage.vue    # Self-registration or invite-based signup
│   ├── ForgotPasswordPage.vue
│   ├── ResetPasswordPage.vue
│   ├── VerifyEmailPage.vue
│   └── DevicePage.vue      # Device authorization (3-step: verify, login, approve)
├── router/
│   └── index.ts            # Routes with /ui/ base, requiresRequestId guard
├── App.vue
├── main.ts
└── style.css               # NHPro dark theme CSS variables + PrimeVue overrides
```

## Key Patterns
- API calls use plain fetch() wrapper (useApi.ts), no Axios
- Auth state managed via reactive composable (useAuthState.ts), not Pinia
- Consent screen has hardcoded French scope descriptions for OIDC scopes only
- All API paths relative to window.location.origin (same-origin)
- Route guard checks meta.requiresRequestId for MFA and consent pages

## OAuth Flow
1. GET /authorize → AuthorizePage (validates params, sets state)
2. POST /authorize/login → LoginPage (credentials)
3. POST /authorize/mfa → MfaPage (if MFA enabled)
4. POST /authorize/consent → ConsentPage (scope approval)
5. Redirect to client with authorization code
