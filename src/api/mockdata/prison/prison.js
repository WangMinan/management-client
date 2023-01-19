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
                        imageUrl: 'http://121.41.227.153:8081/file/00.png'
                    }
                ]
            }
        }
    }
}
