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
    getLogoutData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {}
        }
    }
}
