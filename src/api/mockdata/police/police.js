export default {
    getPersonalProfileData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                id: 1,
                name: '张三',
                accountNumber: '123',
                prisonName: '西安监狱',
                imageUrl:'http://121.41.227.153:8081/file/00.png'
            }
        }
    },
    getTrainingReplyData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {}
        }
    },
    getTrainingHistoryData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                total: 13,
                list: [
                    {
                        id: 88,
                        endTime: "2002-06-05 19:56:50",
                        startTime: "1990-01-18 18:24:42",
                        modelId: 93,
                        modelName: "明外把此素置",
                        status: "non Ut",
                        result: "non incididunt quis Excepteur"
                    },
                    {
                        id: 51,
                        endTime: "2010-10-21 09:42:10",
                        startTime: "2013-07-31 11:12:06",
                        modelId: 44,
                        modelName: "算七军进",
                        status: "officia",
                        result: "ea sed"
                    }
                ]
            }
        }
    },
    getAssessmentData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                mindStatus: '稳定',
                pressureType: '高压'
            }
        }
    }
}
