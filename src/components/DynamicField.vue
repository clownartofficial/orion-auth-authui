<script setup lang="ts">
import { computed } from 'vue'
import type { RegistrationField } from '@/types/registrationField.types'

const props = defineProps<{
  field: RegistrationField
  modelValue: unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: unknown): void
}>()

const fieldId = computed(() => `rf-${props.field.field_key}`)

function update(value: unknown) {
  emit('update:modelValue', value)
}

// Coerce numbers from the native <input type=number> which always
// emits string values via target.value.
function onNumber(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  if (raw === '') {
    update(null)
    return
  }
  const n = Number(raw)
  update(Number.isFinite(n) ? n : null)
}

function toggleMulti(value: string) {
  const current = (props.modelValue as string[]) || []
  if (current.includes(value)) {
    update(current.filter((v) => v !== value))
  } else {
    update([...current, value])
  }
}

function isChecked(value: string): boolean {
  const current = (props.modelValue as string[]) || []
  return current.includes(value)
}
</script>

<template>
  <div class="v2-field">
    <label class="v2-field__label" :for="fieldId">
      {{ field.label }}
      <span v-if="field.required" class="text-danger" aria-label="required">*</span>
    </label>
    <p v-if="field.description" class="text-[11px] text-fg-3 mt-0.5 mb-1">{{ field.description }}</p>

    <!-- text-like inputs -->
    <div
      v-if="['text', 'email', 'url', 'tel'].includes(field.type)"
      class="v2-input-wrap"
    >
      <input
        :id="fieldId"
        :type="field.type"
        :value="modelValue"
        :placeholder="field.placeholder ?? undefined"
        :required="field.required"
        :minlength="field.validation?.min"
        :maxlength="field.validation?.max"
        :pattern="field.validation?.pattern"
        @input="update(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div v-else-if="field.type === 'textarea'" class="v2-input-wrap">
      <textarea
        :id="fieldId"
        :value="modelValue as string"
        :placeholder="field.placeholder ?? undefined"
        :required="field.required"
        :minlength="field.validation?.min"
        :maxlength="field.validation?.max"
        rows="3"
        @input="update(($event.target as HTMLTextAreaElement).value)"
      ></textarea>
    </div>

    <div v-else-if="field.type === 'number'" class="v2-input-wrap">
      <input
        :id="fieldId"
        type="number"
        :value="modelValue ?? ''"
        :placeholder="field.placeholder ?? undefined"
        :required="field.required"
        :min="field.validation?.min"
        :max="field.validation?.max"
        @input="onNumber"
      />
    </div>

    <div v-else-if="field.type === 'date'" class="v2-input-wrap">
      <input
        :id="fieldId"
        type="date"
        :value="modelValue as string"
        :required="field.required"
        @input="update(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div v-else-if="field.type === 'select'" class="v2-input-wrap">
      <select
        :id="fieldId"
        :value="modelValue"
        :required="field.required"
        @change="update(($event.target as HTMLSelectElement).value)"
      >
        <option value="" disabled>{{ field.placeholder || '—' }}</option>
        <option v-for="opt in field.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>

    <div v-else-if="field.type === 'multiselect'" class="flex flex-col gap-1">
      <label
        v-for="opt in field.options"
        :key="opt.value"
        class="flex items-center gap-2 text-[13px] cursor-pointer"
      >
        <input
          type="checkbox"
          :checked="isChecked(opt.value)"
          @change="toggleMulti(opt.value)"
        />
        {{ opt.label }}
      </label>
    </div>

    <div v-else-if="field.type === 'radio'" class="flex flex-col gap-1">
      <label
        v-for="opt in field.options"
        :key="opt.value"
        class="flex items-center gap-2 text-[13px] cursor-pointer"
      >
        <input
          type="radio"
          :name="fieldId"
          :value="opt.value"
          :checked="(modelValue as string) === opt.value"
          :required="field.required"
          @change="update(opt.value)"
        />
        {{ opt.label }}
      </label>
    </div>

    <label
      v-else-if="field.type === 'checkbox'"
      class="flex items-center gap-2 text-[13px] cursor-pointer"
      :for="fieldId"
    >
      <input
        :id="fieldId"
        type="checkbox"
        :checked="modelValue as boolean"
        :required="field.required"
        @change="update(($event.target as HTMLInputElement).checked)"
      />
      {{ field.placeholder || field.label }}
    </label>
  </div>
</template>
