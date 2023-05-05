import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/styles/index.css'
import { Icon } from '@iconify/vue';
import { store } from '@/store'

const app = createApp(App)

app.use(router)
app.use(store)
app.component('Icon', Icon);

app.mount('#app')
