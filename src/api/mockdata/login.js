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
                    name: 'police001',
                    prisonName: '西安监狱',
                    imageUrl:'http://121.41.227.153:8081/file/00.png',
                    training: false
                }
            }
        }
    },
    getPrisonLoginData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                role: 'prison',
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                person: {
                    id: '1',
                    nickname: 'prison001',
                    prisonName: '西安监狱'
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
