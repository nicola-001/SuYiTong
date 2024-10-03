// 引入路由器
import router from "@/router";
// @ts-ignore
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import useUserStore from "@/stores/modules/user";

Nprogress.configure({showSpinner: false})
// 存储用户未登录用户能访问到路由的路径
let witeList = ['/home', '/hospital/register', '/hospital/detail', '/hospital/notice', '/hospital/close', '/hospital/search']
// 前置路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    Nprogress.start()
    // 动态设置标题
    document.title = `医疗-${to.meta.title}`
//     判断用户是否登录
    let token = userStore.userInfo.token
    if (token) {
        next()
    } else {
        if (witeList.includes(to.path)) {
            next()
        } else {
            // 登录组件并展示弹出框
            userStore.visiable = true
            next({path: '/home',query:{redirect:to.fullPath}})
        }
    }

})
// 后置路由守卫
router.afterEach((to, from, next) => {
    Nprogress.done()
})