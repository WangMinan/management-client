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
                path: '/adminPrisonManagement',
                name: 'prisonManagement',
                component: () => import('../views/admin/prison/PrisonManagement.vue'),
                meta: {
                    title: '监所管理系统-监所管理'
                }
            },
            {
                path: '/adminPrisonManagerManagement',
                name: 'prisonManagerManagement',
                component: () => import('../views/admin/prison/PrisonManagerManagement.vue'),
                meta: {
                    title: '监所管理系统-监所管理员管理'
                }
            },
            {
                path: '/adminModelManagement',
                name: 'modelManagement',
                component: () => import('../views/admin/model/ModelManagement.vue'),
                meta: {
                    title: '监所管理系统-训练模型管理'
                }
            },
            {
                path: '/adminOpBoard',
                name: 'opBoard',
                component: () => import('../views/admin/screen/OpBoard.vue'),
                meta: {
                    title: '监所管理系统-运维大屏'
                }
            }
        ]
    },
    {
        path: '/prisonHome',
        name: 'prisonHome',
        component: () => import('../views/prison/PrisonHome.vue'),
        redirect: '/prisonMain',
        meta: {
            title: '监所管理系统-监所首页'
        },
        children: [
            {
                path: '/prisonMain',
                name: 'prisonMain',
                component: () => import('../views/prison/main/PrisonMain.vue'),
                meta: {
                    title: '监所管理系统-监所首页'
                }
            }
        ]
    },
    {
        path: '/policeHome',
        name: 'policeHome',
        component: () => import('../views/police/PoliceHome.vue'),
        redirect: '/policeMain',
        meta: {
            title: '监所管理系统-警员首页'
        },
        children: [
            {
                path: '/policeMain',
                name: 'policeMain',
                component: () => import('../views/police/main/PoliceMain.vue'),
                meta: {
                    title: '监所管理系统-警员首页'
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
    if (!accessToken || !refreshToken) {
        ElMessage.error('您的访问未被授权,可能是您的身份验证已过期,3秒后将跳转至登录页面')
        // 等待三秒
        setTimeout(() => {
            next('/login')
        },3000)
    } else {
        // 鉴权 如果Cookies中的role为admin则仅允许访问adminHome下的页面
        if (Cookies.get('role') === 'admin') {
            if(to.path.startsWith('/admin')) {
                next()
            } else {
                ElMessage.error('您的访问未被授权,请联系管理员')
                next(from.path)
            }
        } else if (Cookies.get('role') === 'prison') {
            if(to.path.startsWith('/prison')) {
                next()
            } else {
                ElMessage.error('您的访问未被授权,请联系管理员')
                next(from.path)
            }
        } else if (Cookies.get('role') === 'police') {
            if(to.path.startsWith('/police')) {
                next()
            } else {
                ElMessage.error('您的访问未被授权,请联系管理员')
                next(from.path)
            }
        } else {
            ElMessage.error('您的访问未被授权,请联系管理员')
            next(from.path)
        }
    }
})

export default router
