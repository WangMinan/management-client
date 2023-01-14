// mock数据模拟
import Mock from 'mockjs'

// 图表数据
let List = []

export default {
    getLoginData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                role: 'admin',
                accessToken: 'accessToken',
                refreshToken: 'refreshToken'
            }
        }
    },
}
