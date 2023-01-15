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
                        name: '监所1'
                    },
                    {
                        id: 2,
                        name: '监所2'
                    },
                    {
                        id: 3,
                        name: '监所3'
                    }
                ]
            }
        }
    }
}
