import axios from 'axios'
import Cookies from 'js-cookie'

// 创建一个axios实例
const _axios = axios.create({
    baseURL: 'http://localhost:8080/api'
})

// 加入拦截器
_axios.interceptors.request.use(
    (req) => {
        // 比如在这里添加统一的 headers
        if (Cookies.get('accessToken') !== null) {
            req.headers.accseeToken = Cookies.get('accessToken')
        }

        return req
    }
)

_axios.interceptors.response.use(
    (resp) => {
        // const { code, data, msg } = resp.data
        return resp;
    }
)

export default _axios
