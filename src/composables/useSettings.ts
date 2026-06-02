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
  default_post_register_redirect_url?: string
}

const registrationEnabled = ref<boolean | null>(null)
const federationProviders = ref<FederationProviderInfo[]>([])
const postRegisterRedirectUrl = ref<string>('')
const loaded = ref(false)

export function useSettings() {
  async function fetchSettings() {
    if (loaded.value) return

    const result = await apiGet<SettingsResponse>('/api/v1/auth/settings')
    if (result.ok) {
      registrationEnabled.value = result.data.registration_enabled
      federationProviders.value = result.data.federation_providers || []
      postRegisterRedirectUrl.value = result.data.default_post_register_redirect_url || ''
    } else {
      registrationEnabled.value = true
      federationProviders.value = []
      postRegisterRedirectUrl.value = ''
    }
    loaded.value = true
  }

  return { registrationEnabled, federationProviders, postRegisterRedirectUrl, fetchSettings }
}
