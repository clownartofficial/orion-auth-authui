import { ref, computed, watchEffect } from 'vue'

const STORAGE_KEY = 'orionauth-theme'

type ThemeMode = 'auto' | 'dark' | 'light'
type ResolvedTheme = 'dark' | 'light'

const mode = ref<ThemeMode>(loadMode())
const systemPreference = ref<ResolvedTheme>(getSystemPreference())

function loadMode(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'auto') return saved
  return 'auto'
}

function getSystemPreference(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

// Listen for system preference changes
const mql = window.matchMedia('(prefers-color-scheme: light)')
function onSystemChange() {
  systemPreference.value = getSystemPreference()
}
mql.addEventListener('change', onSystemChange)

const theme = computed<ResolvedTheme>(() => {
  if (mode.value === 'auto') return systemPreference.value
  return mode.value
})

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.setItem(STORAGE_KEY, mode.value)
})

export function useTheme() {
  function setMode(m: ThemeMode) {
    mode.value = m
  }

  function cycle() {
    const order: ThemeMode[] = ['auto', 'dark', 'light']
    const idx = order.indexOf(mode.value)
    mode.value = order[(idx + 1) % order.length]
  }

  return { theme, mode, setMode, cycle }
}
