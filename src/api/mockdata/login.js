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
                    nickname: 'admin001',
                    account_id: '101'
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
