/*
 * 对整个项目API的管理
*/
import request from './request.js'
export default {
    // home组件左侧表格数据获取
    getHomeData(params) {
        return request({
            url:'/home/getData',
            method: 'get',
            data: params,
            mock: true
        })
    }
}
