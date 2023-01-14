import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'default',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue'),
        meta: {
            title: '监所管理系统-登录'
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

import {ElMessage} from 'element-plus'
import Cookies from 'js-cookie'

// 挂载路由守卫 若请求头中没有access-token或refresh-token则跳转到登录页
router.beforeEach((to, from, next) => {
    // 挂载页面名称
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if (to.path === '/login') {
        return next()
    }
    // 获取请求头
    const accessToken = Cookies.getItem('access-token')
    const refreshToken = Cookies.getItem('refresh-token')
    if (!accessToken && !refreshToken) {
        ElMessage.error('您的访问未被授权,可能是您的身份验证已过期,请重新登录')
        // 等待三秒
        setTimeout(() => {
            next('/login')
        },3000)
    } else {
        // TODO 如果只有refresh-token但access-token过期则刷新access-token
        next()
    }
})

export default router
