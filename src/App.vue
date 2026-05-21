<script setup lang="ts">
import AuthLayout from './layouts/AuthLayout.vue'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <AuthLayout>
    <RouterView />
  </AuthLayout>
  <Toaster />
</template>
