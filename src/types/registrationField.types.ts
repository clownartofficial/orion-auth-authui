// Mirrors orion-auth-backend/model.RegistrationField. Keep in sync
// when the field catalog evolves.

export type RegFieldKind = 'standard' | 'custom'

export type RegFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'url'
  | 'tel'
  | 'number'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'

export type RegContext = 'register' | 'federation'

export interface FieldOption {
  value: string
  label: string
}

export interface FieldValidation {
  min?: number
  max?: number
  pattern?: string
}

export interface RegistrationField {
  id: string
  field_key: string
  label: string
  description?: string | null
  placeholder?: string | null
  kind: RegFieldKind
  standard_target?: string | null
  type: RegFieldType
  required: boolean
  enabled: boolean
  display_order: number
  options: FieldOption[]
  validation: FieldValidation
  applies_to: RegContext[]
}

// Standard targets the AuthUI may want to pre-fill (e.g. display_name
// is already a first-class form field; we de-duplicate via this map
// when rendering dynamically).
export const FIRST_CLASS_TARGETS = new Set(['display_name'])
