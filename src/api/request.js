import axios from 'axios'
import Cookies from 'js-cookie'
import {ElMessage} from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const refreshToken = async () => {
    try {
        // 在请求头中添加refreshToken
        axios.defaults.headers.common['Token'] = Cookies.get('refreshToken')
        // 发送请求
        const {data} = await axios.get('http://localhost:8080/api/backstage-management-service/refreshToken')
        if(data.code === 200) {
            // 更新Cookies中的accessToken
            Cookies.set('accessToken',data.data.accessToken, {expires: 30})
            Cookies.set('refreshToken',data.data.refreshToken, {expires: 30})
            // 删除请求头中的refreshToken
            delete axios.defaults.headers.common['Token']
            return true
        } else {
            ElMessage.error("自动刷新令牌失败,请重新登录")
            // 删除Cookies中的accessToken和refreshToken
            await router.push('/login')
            return false
        }
    } catch (e) {
        ElMessage.error("自动刷新令牌失败,请重新登录")
        // 删除Cookies中的accessToken和refreshToken
        await router.push('/login')
        return false
    }
}

// 创建一个axios实例
const _axios = axios.create({
    baseURL: 'http://localhost:8080/api'
})

// 请求拦截器
_axios.interceptors.request.use(
    (req) => {
        // 比如在这里添加统一的 headers
        if (Cookies.get('accessToken') !== null) {
            req.headers.Token = Cookies.get('accessToken')
        }
        return req
    },
    (err) => {
        return Promise.reject(err)
    }
)

// 响应拦截器
_axios.interceptors.response.use(
    (resp) => {
        // 如果resp中没有data或data中没有code则直接返回
        if (resp.data === undefined || resp.data.code === undefined) {
            return resp
        } else {
            // 对返回的code进行处理
            switch (resp.data.code) {
                case 200:
                    return resp
                case 4010:
                    // access-token 过期 将cookie中的refreshToken放进请求头的Token中
                    // 重新请求access-token
                    refreshToken().then(r => {
                        if (r) {
                            // 重新请求
                            _axios.request(resp.config).then(r => {
                                return r
                            })
                        }
                    })
                    break
                case 4011:
                    // refreshToken 过期 重新登录
                    ElMessage.error('您的访问未被授权,可能是您的身份验证已过期,3秒后将跳转至登录页面')
                    // 等待三秒
                    setTimeout(() => {
                        router.push('/login').then(r => {
                            return r
                        })
                    },3000)
                    break
                case 4012:
                    // 用户未认证或已注销
                    ElMessage.error('您的访问未被授权,可能是您的身份已被注销,请您在登录页面重试,3秒后将执行跳转')
                    // 等待三秒
                    setTimeout(() => {
                        router.push('/login').then(r => {
                            return r
                        })
                    },3000)
                    break
                case 4030:
                    // 用户权限不足
                    ElMessage.error('您的访问未被授权,可能是您的身份权限不足')
                    return resp
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
            }
        }

    },
    (err) => {
        ElMessage.error("响应中出现了一个意外:" + err)
    }
)

export default _axios
