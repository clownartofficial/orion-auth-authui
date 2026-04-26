<script setup lang="ts">
import { computed } from 'vue'
import type { FederationProviderInfo } from '@/composables/useSettings'
import { IconDiscord, IconGitHub, IconSSOEnterprise } from '@/components/icons'

const props = defineProps<{
  providers: FederationProviderInfo[]
}>()

const emit = defineEmits<{
  select: [providerName: string]
}>()

const iconMap: Record<string, any> = {
  discord: IconDiscord,
  github: IconGitHub,
}

const standardProviders = computed(() =>
  props.providers.filter(p => p.type !== 'saml')
)

const samlProviders = computed(() =>
  props.providers.filter(p => p.type === 'saml')
)

function getIcon(provider: FederationProviderInfo) {
  return iconMap[provider.name.toLowerCase()] || IconSSOEnterprise
}

function getLabel(provider: FederationProviderInfo) {
  return provider.display_name || provider.name.charAt(0).toUpperCase() + provider.name.slice(1)
}
</script>

<template>
  <div v-if="providers.length > 0">
    <div v-if="standardProviders.length" class="grid grid-cols-2 gap-2">
      <button
        v-for="p in standardProviders"
        :key="p.name"
        type="button"
        class="fed-btn"
        @click="emit('select', p.name)"
      >
        <component :is="getIcon(p)" :size="16" />
        {{ getLabel(p) }}
      </button>
    </div>

    <button
      v-for="p in samlProviders"
      :key="p.name"
      type="button"
      class="fed-btn mt-2 w-full"
      @click="emit('select', p.name)"
    >
      <IconSSOEnterprise :size="16" />
      {{ getLabel(p) }}
    </button>
  </div>
</template>
