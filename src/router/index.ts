import {createRouter, createWebHistory} from "vue-router";

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            component: () => import('@/views/home/index.vue'),
            meta:{
                title:'首页'
            }
        },
        {
            path: '/hospital',
            component: () => import('@/views/hospital/index.vue'),
            children: [
                {
                    path: 'register',
                    component: () => import('@/views/hospital/register/index.vue'),
                    meta:{
                        title:'预约挂号'
                    }
                },
                {
                    path: 'detail',
                    component: () => import('@/views/hospital/detail/index.vue'),
                    meta:{
                        title:'医院详情'
                    }
                },
                {
                    path: 'notice',
                    component: () => import('@/views/hospital/notice/index.vue'),
                    meta:{
                        title:'预约通知'
                    }
                },
                {
                    path: 'close',
                    component: () => import('@/views/hospital/close/index.vue'),
                    meta:{
                        title:'停诊信息'
                    }
                },
                {
                    path: 'search',
                    component: () => import('@/views/hospital/search/index.vue'),
                    meta:{
                        title:'查询'
                    }
                },
                {
                    path: 'register_stype1',
                    component: () => import('@/views/hospital/register/register_stype1.vue'),
                    meta:{
                        title:'预约第一步'
                    }
                },
                {
                    path: 'register_stype2',
                    component: () => import('@/views/hospital/register/register_stype2.vue'),
                    meta:{
                        title:'预约第二步'
                    }
                },

            ]
        },
        {
            path: '/wxlogin',
            component: () => import('@/views/wxlogin/index.vue')
        },
        {
            path: '/',
            component: () => import('@/views/home/index.vue')
        },
        {
            path: '/user',
            component: () => import('@/views/user/index.vue'),
            children:[
                {
                    path:'certification',
                    component: () => import('@/views/user/certification/index.vue'),
                    meta:{
                        title:'实名认证'
                    }
                },
                {
                    path:'order',
                    component: () => import('@/views/user/order/index.vue'),
                    meta:{
                        title:'挂号订单'
                    }
                },
                {
                    path:'patient',
                    component: () => import('@/views/user/patient/index.vue'),
                    meta:{
                        title:'就诊人管理'
                    }
                },
                {
                    path:'profile',
                    component: () => import('@/views/user/profile/index.vue'),
                    meta:{
                        title:'账号信息'
                    }
                },
                {
                    path:'feedback',
                    component: () => import('@/views/user/feedback/index.vue'),
                    meta:{
                        title:'信息反馈'
                    }
                },
            ]
        }
    ],
//     设置路由跳转的滚动行为
    scrollBehavior() {
        return {
            left: 0,
            top: 0
        }
    }
})