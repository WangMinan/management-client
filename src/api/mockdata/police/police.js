export default {
    getPersonalProfileData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                name: '张三',
                accountNumber: '123',
                prisonName: '西安监狱',
                imageUrl:'http://121.41.227.153:8081/file/00.png'
            }
        }
    }
}
