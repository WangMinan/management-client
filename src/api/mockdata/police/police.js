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
                imageUrl:'https://wangminan-files.oss-cn-hongkong.aliyuncs.com/police/%E7%8E%8B%E6%97%BB%E5%AE%89_1674377623528_de41b40b.jpg'
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
    },
    getTrainingSummaryData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                // 今日预计模拟场景
                dailyTasks: 5,
                // 今日已完成模拟场景
                dailyCompletedTasks: 2,
                // 本周完成
                weeklyModels: 10,
            }
        }
    },
    getTrainingDynamicData: () => {
        return {
            code: 200,
            msg: 'success',
            data: [
                {
                    modelName: '模拟场景1',
                    startTime: '2019-01-01 12:00:00',
                    endTime: '2019-01-01 13:00:00'
                },
                {
                    modelName: '模拟场景2',
                    startTime: '2019-01-01 12:00:00',
                    endTime: '2019-01-01 13:00:00'
                },
                {
                    modelName: '模拟场景3',
                    startTime: '2019-01-01 12:00:00',
                    endTime: '2019-01-01 13:00:00'
                }
            ]
        }
    },
    getWeeklyTrainingData: () => {
        return {
            code: 200,
            msg: 'success',
            data: [
                0, 4, 5, 3, 2, 1, 0
            ]
        }
    },
    getAllPrisonsData: () => {
        return {
            code: 200,
            msg: 'success',
            data: [
                '西安监狱',
                '上海监狱',
                '北京监狱',
                '南京监狱'
            ]
        }
    },
    getIsTrainingData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                isTraining: true
            }
        }
    }
}
