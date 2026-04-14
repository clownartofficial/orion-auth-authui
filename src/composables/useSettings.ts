import { ref } from 'vue'
import { apiGet } from './useApi'

const registrationEnabled = ref<boolean | null>(null)
const loaded = ref(false)

export function useSettings() {
  async function fetchSettings() {
    if (loaded.value) return

    const result = await apiGet<{ registration_enabled: boolean }>('/api/v1/auth/settings')
    if (result.ok) {
      registrationEnabled.value = result.data.registration_enabled
    } else {
      registrationEnabled.value = true
    }
    loaded.value = true
  }

  return { registrationEnabled, fetchSettings }
}
