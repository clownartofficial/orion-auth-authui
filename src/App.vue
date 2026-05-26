<script setup lang="ts">
import AuthLayout from './layouts/AuthLayout.vue'
import { Toaster } from '@/components/ui/sonner'
import { usePasswordPolicy } from '@/composables/usePasswordPolicy'

usePasswordPolicy().fetchPolicy()
</script>

<template>
  <AuthLayout>
    <RouterView />
  </AuthLayout>
  <Toaster />
</template>
