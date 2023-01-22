export default {
    reviseNicknameData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {}
        }
    },
    getAccessData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                workingModeNumber: 12,
                finishTrainTimeDaily: 44,
                loginTimeDaily: 12,
                finishTrainTimeWeekly: 154
            }
        }
    },
    getModelUseData: () => {
        return{
            code: 200,
            msg: "success",
            data: [
                {
                    policeName: "处有线干根",
                    modelName: "四候求热热",
                    endTime: "1974-03-06 01:58:56"
                },
                {
                    policeName: "强她热广她因",
                    modelName: "无运期从",
                    endTime: "2017-04-04 16:45:50"
                },
                {
                    policeName: "强她热广她因",
                    modelName: "无运期从",
                    endTime: "2017-04-04 16:45:50"
                }
            ]
        }
    },
    getFinishTrainingData: () => {
        return{
            code: 200,
            msg: "success",
            data: [
                {
                    modelName: "当标这整近社江",
                    numberOfPolice: 81
                },
                {
                    modelName: "导断没标",
                    numberOfPolice: 27
                },
                {
                    modelName: "务务任办群支",
                    numberOfPolice: 72
                }
            ]
        }
    },
    getPoliceListData: () => {
        return {
            code: 200,
            msg: "success",
            data: {
                total: 1,
                list: [
                    {
                        id: 1,
                        name: '张三',
                        accountNumber: '123',
                        prisonName: '西安监狱',
                        imageUrl: 'https://wangminan-files.oss-cn-hongkong.aliyuncs.com/police/%E7%8E%8B%E6%97%BB%E5%AE%89_1674377623528_de41b40b.jpg'
                    }
                ]
            }
        }
    },
    getAllModelNamesData: () => {
        return {
            code: 200,
            msg: "success",
            data: [
                '模型1','模型2','模型3'
            ]
        }
    },
    getTrainingHistoryListData: () => {
        return {
            code: 200,
            msg: "success",
            data: {
                total: 3,
                list: [
                    {
                        id: 1,
                        policeId: 1,
                        policeName: '张三',
                        modelId: 1,
                        modelName: '模型1',
                        startTime: '2021-05-01 12:00:00',
                        endTime: '2021-05-01 13:00:00',
                        status: '已完成',
                        result: '通过'
                    },
                    {
                        id: 2,
                        policeId: 1,
                        policeName: '张三',
                        modelId: 2,
                        modelName: '模型2',
                        startTime: '2021-05-01 15:00:00',
                        endTime: '2021-05-01 16:00:00',
                        status: '已完成',
                        result: '通过'
                    },
                    {
                        id: 3,
                        policeId: 2,
                        policeName: '李四',
                        modelId: 3,
                        modelName: '模型3',
                        startTime: '2021-05-01 17:00:00',
                        endTime: '2021-05-01 18:00:00',
                        status: '未完成',
                        result: '未通过'
                    }
                ]
            }
        }
    }
}
