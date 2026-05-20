import { ref } from 'vue'
import { apiGet } from './useApi'
import type { RegContext, RegistrationField } from '@/types/registrationField.types'

// Per-context cache: each context only triggers one fetch per page load.
const cache = new Map<RegContext, RegistrationField[]>()
const loadingByContext = new Map<RegContext, boolean>()

export function useRegistrationSchema(context: RegContext) {
  const schema = ref<RegistrationField[]>(cache.get(context) ?? [])
  const loading = ref<boolean>(loadingByContext.get(context) ?? false)
  const error = ref<string | null>(null)

  async function fetchSchema() {
    if (cache.has(context)) {
      schema.value = cache.get(context) as RegistrationField[]
      return
    }
    loading.value = true
    loadingByContext.set(context, true)
    const res = await apiGet<{ fields: RegistrationField[] }>(
      `/api/v1/auth/registration-fields?context=${context}`,
    )
    loading.value = false
    loadingByContext.set(context, false)
    if (!res.ok) {
      error.value = res.message
      schema.value = []
      cache.set(context, [])
      return
    }
    const fields = res.data.fields || []
    cache.set(context, fields)
    schema.value = fields
  }

  return { schema, loading, error, fetchSchema }
}

// Builds the initial form-state object {field_key: defaultValue} for a
// given schema. Strings default to '', checkboxes to false, multiselect
// to []. Used by RegisterPage / CompleteAccountPage on mount.
export function initialValues(schema: RegistrationField[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const f of schema) {
    switch (f.type) {
      case 'checkbox':
        out[f.field_key] = false
        break
      case 'multiselect':
        out[f.field_key] = [] as string[]
        break
      case 'number':
        out[f.field_key] = null
        break
      default:
        out[f.field_key] = ''
    }
  }
  return out
}
