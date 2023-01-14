import axios from 'axios'

// 创建一个axios实例
const _axios = axios.create({
    baseURL: config.baseUrl
})

// 加入拦截器
_axios.interceptors.request.use(
    (req) => {
        // 在这里可以统一处理请求
        return req
        // // 比如在这里添加统一的 headers
        // if (window.sessionStorage.getItem('token') !== null) {
        //     config.headers.token = window.sessionStorage.getItem('token')
        // }
        // return config
    }
)

_axios.interceptors.response.use(
    (resp) => {
        // const { code, data, msg } = resp.data
        return resp;
    }
)

export default _axios
