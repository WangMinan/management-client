import Mock from 'mockjs'
import loginApi from './mockdata/login.js'
import adminApi from './mockdata/admin/admin.js'
import policeApi from './mockdata/police/police.js'
import prisonApi from './mockdata/prison/prison.js'

// 拦截请求
// 登录
// Mock.mock('http://localhost:8080/api/backstage-management-service/login',
//     loginApi.getAdminLoginData())
// Mock.mock('http://localhost:8080/api/backstage-management-service/login',
//     loginApi.getPoliceLoginData())
Mock.mock('http://localhost:8080/api/backstage-management-service/login',
    loginApi.getPrisonLoginData())

// 退出
Mock.mock('http://localhost:8080/api/backstage-management-service/logout',
    loginApi.getLogoutData())

// 运维
Mock.mock('http://localhost:8080/api/backstage-management-service/account/password',
    adminApi.getRevisePasswordData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/admin/prison'+'.*'),
    adminApi.getPrisonTotalData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/admin/padmin'+'.*'),
    adminApi.getPrisonManagerTotalData())
Mock.mock(RegExp('http://localhost:8080/api/psychology-service/model'+'.*'),
    adminApi.getModelTotalData())
Mock.mock('http://localhost:8080/api/backstage-management-service/admin/stats',
    adminApi.getAccessData())
Mock.mock('http://localhost:8080/api/backstage-management-service/admin/mainPage/dynamic',
    adminApi.getModelUseData())

// 警员
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/police/profile'+'.*'),
    policeApi.getPersonalProfileData())
Mock.mock(RegExp('http://localhost:8080/api/psychology-service/training'+'.*'),
    policeApi.getTrainingReplyData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/police/query'+'.*'),
    policeApi.getTrainingHistoryData())
Mock.mock('http://localhost:8080/api/backstage-management-service/police/totalResult',
    policeApi.getAssessmentData())
Mock.mock('http://localhost:8080/api/backstage-management-service/police/home/training',
    policeApi.getTrainingSummaryData())
Mock.mock('http://localhost:8080/api/backstage-management-service/police/home/dynamic',
    policeApi.getTrainingDynamicData())
Mock.mock('http://localhost:8080/api/backstage-management-service/police/home/weekTraining',
    policeApi.getWeeklyTrainingData())

// 监所
Mock.mock('http://localhost:8080/api/backstage-management-service/prison/mainPage',
    prisonApi.getAccessData())
Mock.mock('http://localhost:8080/api/backstage-management-service/prison/mainPage/dynamic',
    prisonApi.getModelUseData())
Mock.mock('http://localhost:8080/api/backstage-management-service/prison/mainPage/stats',
    prisonApi.getFinishTrainingData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/prison/police/query' + '.*'),
    prisonApi.getPoliceListData())
Mock.mock('http://localhost:8080/api/backstage-management-service/prison/prison',
    policeApi.getAllPrisonsData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/prison/model' + '.*'),
    adminApi.getModelTotalData())
Mock.mock('http://localhost:8080/api/backstage-management-service/prison/trainDynamic',
    prisonApi.getAllModelNamesData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/prison/dynamic/query' + '.*'),
    prisonApi.getTrainingHistoryListData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/prison/totalAssess' + '.*'),
    prisonApi.getTrainingAssessmentData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/prison/'+'.*'),
    prisonApi.reviseNicknameData())
