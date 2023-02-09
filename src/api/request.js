import axios from 'axios'
import Cookies from 'js-cookie'
import {ElMessage} from 'element-plus'
import router from '../router/index'
import {start, stop} from '../utils/nprogressUtil'

// 创建一个axios实例
const _axios = axios.create({
    baseURL: 'http://123.249.5.227:8079/api'
})

const refreshToken = async () => {
    try {
        // 在请求头中添加refreshToken
        if(Cookies.get('refreshToken') === undefined) {
            ElMessage.error("自动刷新令牌失败,请重新登录")
            // 删除Cookies中的accessToken和refreshToken
            Cookies.remove('manualExit')
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            await router.push('/login')
            return false
        }
        // 将refreshToken放进请求头的Authorization中
        _axios.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('refreshToken')
        // 发送请求
        const resp = await _axios.get('/backstage-management-service/token-refresh')
        const data = resp.data
        if(data.code === 2000) {
            // 更新Cookies中的accessToken
            Cookies.set('accessToken',data.data.accessToken, {expires: 30})
            Cookies.set('refreshToken',data.data.refreshToken, {expires: 30})
            // 重置请求头
            _axios.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('accessToken')
            firstTimeToRefresh = true
            return true
        } else {
            ElMessage.error("自动刷新令牌失败,请重新登录或再次点击登录")
            // 删除Cookies中的accessToken和refreshToken
            Cookies.remove('manualExit')
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            await router.push('/login')
            return false
        }
    } catch (e) {
        ElMessage.error("自动刷新令牌失败,请重新登录或再次点击登录")
        // 删除Cookies中的accessToken和refreshToken
        Cookies.remove('manualExit')
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        await router.push('/login')
        return false
    }
}

// 请求拦截器
_axios.interceptors.request.use(
    (req) => {
        start()
        // 比如在这里添加统一的 headers
        if (Cookies.get('accessToken') !== undefined) {
            req.headers.Authorization = 'Bearer ' + Cookies.get('accessToken')
        }
        return req
    },
    (err) => {
        return Promise.reject(err)
    }
)

let firstTimeToRefresh = true

const refreshOrBackToLogin = async () => {
    if (firstTimeToRefresh) {
        firstTimeToRefresh = false
        await refreshToken()
    } else {
        if(router.currentRoute.value.path !== '/login') {
            ElMessage.error('您的访问未被授权,可能是您的身份验证已过期,3秒后将跳转至登录页面')
            // 等待三秒
            setTimeout(() => {
                Cookies.remove('manualExit')
                Cookies.remove('accessToken')
                Cookies.remove('refreshToken')
                router.push('/login').then(r => {
                    return r
                })
            }, 3000)
        } else {
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            ElMessage.error('您的访问未被授权,可能是您的身份验证已过期,请重新登录')
        }
    }
}

// 响应拦截器
_axios.interceptors.response.use(
    async (resp) => {
        // 如果resp中没有data或data中没有code则直接返回
        stop()
        // sts临时授权
        if (resp.data.AccessKeyId !== undefined) {
            return resp
        }
        if (resp.data.code === undefined) {
            ElMessage.error('后端服务器异常,请联系管理员')
        } else {
            // 对返回的code进行处理
            switch (resp.data.code) {
                case 2000:
                    return resp
                case 400:
                    // 通用请求错误
                    ElMessage.error(resp.data.msg)
                    return Promise.reject(resp)
                case 4000:
                    if (resp.data.msg === 'Invalid JWT token') {
                        // access-token 过期 将cookie中的refreshToken放进请求头的Token中
                        // 重新请求access-token
                        await refreshOrBackToLogin()
                    } else {
                        ElMessage.error(resp.data.msg)
                        return Promise.reject(resp)
                    }
                    break
                case 4010:
                    // access-token 过期 将cookie中的refreshToken放进请求头的Token中
                    // 重新请求access-token
                    await refreshOrBackToLogin()
                    break
                case 4011:
                    await refreshOrBackToLogin()
                    break
                case 4012:
                    if (router.currentRoute.value.path !== '/login') {
                        // 用户未认证或已注销
                        ElMessage.error('您的访问未被授权,可能是您的身份已被注销,请您在登录页面重试,3秒后将执行跳转')
                        // 等待三秒
                        setTimeout(() => {
                            Cookies.remove('manualExit')
                            Cookies.remove('accessToken')
                            Cookies.remove('refreshToken')
                            router.push('/login').then(r => {
                                return r
                            })
                        }, 3000)
                    } else {
                        ElMessage.error(resp.data.msg)
                    }
                    break
                case 4030:
                    // 用户权限不足
                    ElMessage.error('您的访问未被授权,可能是您的身份权限不足')
                    return Promise.reject(resp)
                case 4040:
                    // 请求的资源不存在
                    ElMessage.error('您的请求的资源不存在,当前页面将被刷新')
                    router.push(router.currentRoute.value.fullPath).then(r => {
                        return r
                    })
                    break
                case 5000:
                    // 后端服务异常
                    ElMessage.error('后端服务异常,当前页面将被刷新,若无效请联系管理员')
                    router.push(router.currentRoute.value.fullPath).then(r => {
                        return r
                    })
                    break
                default:
                    // 未知情况
                    return resp
            }
        }

    },
    (err) => {
        stop()
        ElMessage.error('后端服务器异常,请联系管理员')
        return Promise.reject(err)
    }
)

export default _axios
