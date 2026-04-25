import { ref } from 'vue'
import { apiGet } from './useApi'

export interface FederationProviderInfo {
  name: string
  display_name: string | null
  type: string
}

interface SettingsResponse {
  registration_enabled: boolean
  federation_providers?: FederationProviderInfo[]
}

const registrationEnabled = ref<boolean | null>(null)
const federationProviders = ref<FederationProviderInfo[]>([])
const loaded = ref(false)

export function useSettings() {
  async function fetchSettings() {
    if (loaded.value) return

    const result = await apiGet<SettingsResponse>('/api/v1/auth/settings')
    if (result.ok) {
      registrationEnabled.value = result.data.registration_enabled
      federationProviders.value = result.data.federation_providers || []
    } else {
      registrationEnabled.value = true
      federationProviders.value = []
    }
    loaded.value = true
  }

  return { registrationEnabled, federationProviders, fetchSettings }
}
