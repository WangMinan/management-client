export default {
    getAdminLoginData: () => {
        return {
            code: 2000,
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
            code: 2000,
            msg: 'success',
            data: {
                role: 'police',
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                person: {
                    id: '1',
                    name: 'police001',
                    prisonName: '西安监狱',
                    imageUrl:'https://wangminan-files.oss-cn-hongkong.aliyuncs.com/police/%E7%8E%8B%E6%97%BB%E5%AE%89_1674377623528_de41b40b.jpg',
                    training: false
                }
            }
        }
    },
    getPrisonLoginData: () => {
        return {
            code: 2000,
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
            code: 2000,
            msg: 'success',
            data: {}
        }
    }
}
