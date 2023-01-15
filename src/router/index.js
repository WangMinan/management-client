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
    },
    {
        path: '/adminHome',
        name: 'adminHome',
        component: () => import('../views/admin/AdminHome.vue'),
        redirect: '/adminMain',
        meta: {
            title: '监所管理系统-运维首页'
        },
        children: [
            {
                path: '/adminMain',
                name: 'main',
                component: () => import('../views/admin/main/AdminMain.vue'),
                meta: {
                    title: '监所管理系统-运维首页'
                }
            },
            {
                path: '/prisonManagement',
                name: 'prisonManagement',
                component: () => import('../views/admin/prison/PrisonManagement.vue'),
                meta: {
                    title: '监所管理系统-监所管理'
                }
            },
            {
                path: '/prisonManagerManagement',
                name: 'prisonManagerManagement',
                component: () => import('../views/admin/prison/PrisonManagerManagement.vue'),
                meta: {
                    title: '监所管理系统-监所管理员管理'
                }
            },
            {
                path: '/modelManagement',
                name: 'modelManagement',
                component: () => import('../views/admin/model/ModelManagement.vue'),
                meta: {
                    title: '监所管理系统-训练模型管理'
                }
            },
            {
                path: '/opBoard',
                name: 'opBoard',
                component: () => import('../views/admin/screen/OpBoard.vue'),
                meta: {
                    title: '监所管理系统-运维大屏'
                }
            }
        ]
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
    const accessToken = Cookies.get('accessToken')
    const refreshToken = Cookies.get('refreshToken')
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
