import { createApp } from 'vue'
import './assets/style/main.css'
import router from './router/index.js'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store/index.js'
import './api/mock.js'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 引入黑夜模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入自定义黑色主题
import './assets/style/dark.less'

const app = createApp(App)
    .use(router)
    .use(ElementPlus,{
        locale: zhCn
    })
    .use(store)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
