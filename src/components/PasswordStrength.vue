<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePasswordPolicy } from '@/composables/usePasswordPolicy'
import { getZxcvbnCheck } from '@/lib/zxcvbn'

const props = withDefaults(defineProps<{
  password: string
  userInputs?: string[]
}>(), {
  userInputs: () => [],
})

const emit = defineEmits<{
  'update:valid': [boolean]
}>()

const { policy } = usePasswordPolicy()

const zxcvbnScore = ref<number | null>(null)
let debounceHandle: ReturnType<typeof setTimeout> | null = null

interface Rule {
  label: string
  passed: boolean
}

const charClasses = computed(() => {
  const p = props.password
  return {
    hasUpper: /[A-Z]/.test(p),
    hasLower: /[a-z]/.test(p),
    hasDigit: /[0-9]/.test(p),
    hasSymbol: /[^A-Za-z0-9]/.test(p),
  }
})

const rules = computed<Rule[]>(() => {
  const p = props.password
  const out: Rule[] = []

  out.push({
    label: `Au moins ${policy.value.min_length} caractères`,
    passed: p.length >= policy.value.min_length,
  })
  if (policy.value.max_length > 0 && p.length > 0) {
    out.push({
      label: `Au plus ${policy.value.max_length} caractères`,
      passed: p.length <= policy.value.max_length,
    })
  }
  if (policy.value.require_uppercase) {
    out.push({ label: 'Une majuscule', passed: charClasses.value.hasUpper })
  }
  if (policy.value.require_lowercase) {
    out.push({ label: 'Une minuscule', passed: charClasses.value.hasLower })
  }
  if (policy.value.require_digit) {
    out.push({ label: 'Un chiffre', passed: charClasses.value.hasDigit })
  }
  if (policy.value.require_symbol) {
    out.push({ label: 'Un symbole', passed: charClasses.value.hasSymbol })
  }
  if (policy.value.min_score > 0) {
    const current = zxcvbnScore.value
    out.push({
      label: `Force minimum: ${strengthLabel(policy.value.min_score)}`,
      passed: current !== null && current >= policy.value.min_score,
    })
  }

  return out
})

const score = computed(() => zxcvbnScore.value ?? 0)
const scorePercent = computed(() => ((score.value + 1) / 5) * 100)

const scoreLabel = computed(() => {
  if (!props.password) return ''
  if (zxcvbnScore.value === null) return 'Analyse…'
  return strengthLabel(zxcvbnScore.value)
})

const barColor = computed(() => {
  const s = score.value
  if (s <= 0) return 'var(--danger)'
  if (s === 1) return 'var(--warn)'
  if (s === 2) return 'var(--warn)'
  if (s === 3) return 'var(--success)'
  return 'var(--success)'
})

const allRulesPassed = computed(() => rules.value.every((r) => r.passed) && props.password.length > 0)

watch(allRulesPassed, (v) => emit('update:valid', v), { immediate: true })

watch(
  () => props.password,
  (pwd) => {
    if (debounceHandle) clearTimeout(debounceHandle)
    if (!pwd) {
      zxcvbnScore.value = null
      return
    }
    debounceHandle = setTimeout(async () => {
      try {
        const check = await getZxcvbnCheck()
        const sanitizedInputs = props.userInputs.map((s) => s.trim()).filter(Boolean)
        const result = check(pwd, sanitizedInputs)
        zxcvbnScore.value = result.score
      } catch {
        zxcvbnScore.value = null
      }
    }, 200)
  },
  { immediate: true },
)

function strengthLabel(s: number): string {
  switch (s) {
    case 0: return 'Très faible'
    case 1: return 'Faible'
    case 2: return 'Moyen'
    case 3: return 'Fort'
    case 4: return 'Très fort'
    default: return ''
  }
}
</script>

<template>
  <div class="password-strength" v-if="password.length > 0">
    <div class="password-strength__bar" aria-hidden="true">
      <div
        class="password-strength__bar-fill"
        :style="{ width: `${scorePercent}%`, background: barColor }"
      />
    </div>
    <div class="password-strength__meta">
      <span class="password-strength__label">{{ scoreLabel }}</span>
    </div>
    <ul class="password-strength__rules">
      <li
        v-for="rule in rules"
        :key="rule.label"
        :class="{ 'is-passed': rule.passed }"
      >
        <span class="password-strength__mark" aria-hidden="true">{{ rule.passed ? '✓' : '○' }}</span>
        {{ rule.label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.password-strength {
  margin-top: 8px;
  font-size: 12px;
  color: var(--fg-2);
}

.password-strength__bar {
  height: 4px;
  background: var(--bg-2);
  border-radius: 999px;
  overflow: hidden;
}

.password-strength__bar-fill {
  height: 100%;
  transition: width 220ms cubic-bezier(0.2, 0, 0, 1), background 220ms;
}

.password-strength__meta {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
  font-size: 11px;
  color: var(--fg-3);
}

.password-strength__rules {
  list-style: none;
  padding: 0;
  margin: 6px 0 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 12px;
}

.password-strength__rules li {
  color: var(--fg-3);
  display: flex;
  align-items: center;
  gap: 6px;
}

.password-strength__rules li.is-passed {
  color: var(--success);
}

.password-strength__mark {
  display: inline-flex;
  width: 12px;
  justify-content: center;
  font-weight: 600;
}
</style>
