export default {
    getRevisePasswordData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {}
        }
    },
    getPrisonTotalData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                total: 3,
                list: [
                    {
                        id: 1,
                        name: '西安监狱'
                    },
                    {
                        id: 2,
                        name: '上海监狱'
                    },
                    {
                        id: 3,
                        name: '南京监狱'
                    }
                ]
            }
        }
    },
    getPrisonManagerTotalData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                total: 3,
                list: [
                    {
                        nickname: "夏洋",
                        accountNumber: "99",
                        prisonName: "西安监狱"
                    },
                    {
                        nickname: "陆桂英",
                        accountNumber: "49",
                        prisonName: "上海监狱"
                    },
                    {
                        nickname: "哈哈哈",
                        accountNumber: "1099",
                        prisonName: "南京监狱"
                    }
                ]
            }
        }
    }
}
