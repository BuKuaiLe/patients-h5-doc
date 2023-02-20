import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/main.scss'
import pinia from './stores'
import persist from 'pinia-plugin-persistedstate'

import './assets/main.css'
// 1. 引入你需要的组件
import { Button } from 'vant'
// 2. 引入组件样式
import 'vant/lib/index.css'
const app = createApp(App)

app.use(createPinia().use(persist))
app.use(router)
app.use(Button)
app.use(pinia)
app.mount('#app')
