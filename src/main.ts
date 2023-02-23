import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './styles/main.scss'
// 导入pinia实例
import pinia from './stores/index'
import 'virtual:svg-icons-register'
import './assets/main.css'
// 1. 引入vant组件
import { Button } from 'vant'
// 2. 引入组件样式
import 'vant/lib/index.css'
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Button)

app.mount('#app')
