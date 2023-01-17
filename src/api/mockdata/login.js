export default {
    getAdminLoginData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                role: 'admin',
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                person: {
                    id: '1',
                    nickname: 'admin001',
                    account_id: '101'
                }
            }
        }
    },
    getPoliceLoginData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                role: 'police',
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                person: {
                    id: '1',
                    nickname: 'police001',
                    account_id: '101',
                    prison_id: '1',
                    image_url:'http://121.41.227.153:8081/file/00.png'
                }
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
