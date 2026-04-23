import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import router from './router';
import App from './App.vue';
import './style.css';
const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    },
});
app.use(ToastService);
app.use(router);
app.mount('#app');
