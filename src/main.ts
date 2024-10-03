import {createApp} from 'vue'
// 清除默认样式
import '@/style/reset.scss'
import App from '@/App.vue'
import router from '@/router'
// 引入element-plus插件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import pinia from '@/stores/index'
// 引入全局组件-顶部底部都是全局组件
import HospitalTop from '@/components/hospital_top/index.vue'
import HospitalBottom from '@/components/hospital_bottom/index.vue'
import Login from "@/components/login/login.vue";
import Visitor from "@/components/visitor/visitor.vue";
import './permission'

const app = createApp(App)
app.component('HospitalTop', HospitalTop)
app.component('HospitalBottom', HospitalBottom)
app.component('Login', Login)
app.component('Visitor', Visitor)
// 安装router
app.use(router)
// 安装element-plus插件
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(pinia)
app.mount('#app')
