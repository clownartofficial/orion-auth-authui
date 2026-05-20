import { createRouter, createWebHistory } from 'vue-router'
import { useAuthState } from '../composables/useAuthState'

const router = createRouter({
  history: createWebHistory('/ui/'),
  routes: [
    {
      path: '/authorize',
      component: () => import('../pages/AuthorizePage.vue'),
    },
    {
      path: '/login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/mfa',
      component: () => import('../pages/MfaPage.vue'),
      meta: { requiresRequestId: true },
    },
    {
      path: '/consent',
      component: () => import('../pages/ConsentPage.vue'),
      meta: { requiresRequestId: true },
    },
    {
      path: '/register',
      component: () => import('../pages/RegisterPage.vue'),
    },
    {
      path: '/forgot-password',
      component: () => import('../pages/ForgotPasswordPage.vue'),
    },
    {
      path: '/reset-password',
      component: () => import('../pages/ResetPasswordPage.vue'),
    },
    {
      path: '/verify-email',
      component: () => import('../pages/VerifyEmailPage.vue'),
    },
    {
      path: '/device',
      component: () => import('../pages/DevicePage.vue'),
    },
    {
      path: '/logout',
      component: () => import('../pages/LogoutPage.vue'),
    },
    {
      path: '/link-account',
      component: () => import('../pages/LinkAccountPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/authorize',
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresRequestId) {
    const { state } = useAuthState()
    if (!state.requestId) {
      return '/authorize'
    }
  }
})

export default router
