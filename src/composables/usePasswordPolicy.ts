import { ref } from 'vue'
import { apiGet } from './useApi'

export interface PasswordPolicy {
  min_length: number
  max_length: number
  require_uppercase: boolean
  require_lowercase: boolean
  require_digit: boolean
  require_symbol: boolean
  min_score: 0 | 1 | 2 | 3 | 4
}

interface PolicyResponse {
  policy: PasswordPolicy
}

export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  min_length: 8,
  max_length: 128,
  require_uppercase: false,
  require_lowercase: false,
  require_digit: false,
  require_symbol: false,
  min_score: 0,
}

const policy = ref<PasswordPolicy>({ ...DEFAULT_PASSWORD_POLICY })
const loaded = ref(false)

export function usePasswordPolicy() {
  async function fetchPolicy() {
    if (loaded.value) return

    const result = await apiGet<PolicyResponse>('/api/v1/password-policy')
    if (result.ok) {
      policy.value = result.data.policy
    }
    loaded.value = true
  }

  return { policy, fetchPolicy }
}
