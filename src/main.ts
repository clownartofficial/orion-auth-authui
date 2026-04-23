import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import OrionPreset from './styles/primevue-preset'
import router from './router'
import App from './App.vue'
import './styles/app.css'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: OrionPreset,
    options: {
      darkModeSelector: '[data-theme="dark"]',
      cssLayer: false,
    },
  },
})
app.use(ToastService)
app.use(router)

app.mount('#app')
