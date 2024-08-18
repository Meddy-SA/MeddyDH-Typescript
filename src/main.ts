import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import MyPreset from './config/myPreset'
import Ripple from 'primevue/ripple'

import './style.css'
import 'primeicons/primeicons.css'
import App from './App.vue'

// get middlewares
import routers from './routers'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(routers)

// PrimeVUE
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: MyPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.my-app-dark',
      cssLayer: false
    }
  }
})

// Directivas
app.directive('ripple', Ripple)

app.mount('#app')
