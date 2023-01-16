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
    },
    getModelTotalData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                total: 3,
                list: [
                    {
                        id: 76,
                        name: "路格报书头",
                        description: "深王的际米江力色连题这展图。强最清门外研众习器战研还设边书。世集数史证复持育今展素厂。教主热查流派线人得书养金中百目该。深行整记想与第件只导再利少究收格。叫指与两律但精才养强月观主长些值。",
                        enable: false,
                        priority: 14
                    },
                    {
                        id: 41,
                        name: "期社往火",
                        description: "南队来风参适政维月名装正然受必反先。儿少院这能群角界处查以却党。响化应府间则日先被按委九青。青广都影报加始果外可规没产时。非安办劳中周工发整民应看思要法几约。保工美且前际但而切革克主阶直里斯。",
                        enable: true,
                        priority: 85
                    },
                    {
                        id: 92,
                        name: "利自切还不认",
                        description: "说科也毛压适油必志理青三别历头。细须两至加状队量此内每认教平她持带。么基代而去万将高属将信识被治书命。这院小些义对划满件本清族特众身。",
                        enable: false,
                        priority: 11
                    }
                ]
            }
        }
    },
    getAccessData: () => {
        return {
            code: 200,
            msg: 'success',
            data: {
                accessCount: 37,
                trainingCount: 99,
                weeklyTrainingCount: 72,
                flow: 19,
                accessLastWeek:[
                    10,30,25,10,20,30,40
                ]
            }
        }
    },
    getModelUseData: () => {
        return{
            code: 200,
            msg: "success",
            data: [
                {
                    prisonName: "处有线干根",
                    modelName: "四候求热热",
                    operation: true,
                    time: "1974-03-06 01:58:56"
                },
                {
                    prisonName: "强她热广她因",
                    modelName: "无运期从",
                    operation: true,
                    time: "2017-04-04 16:45:50"
                },
                {
                    prisonName: "强她热广她因",
                    modelName: "无运期从",
                    operation: false,
                    time: "2017-04-04 16:45:50"
                }
            ]
        }
    }
}
