import Mock from 'mockjs'
import loginApi from './mockdata/login.js'
import adminApi from './mockdata/admin/admin.js'
import policeApi from './mockdata/police/police.js'

// 拦截请求
Mock.mock('http://localhost:8080/api/backstage-management-service/login',
    loginApi.getPoliceLoginData())
Mock.mock('http://localhost:8080/api/backstage-management-service/account/password',
    adminApi.getRevisePasswordData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/admin/prison'+'.*'),
    adminApi.getPrisonTotalData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/admin/padmin'+'.*'),
    adminApi.getPrisonManagerTotalData())
Mock.mock('http://localhost:8080/api/backstage-management-service/logout',
    loginApi.getLogoutData())
Mock.mock(RegExp('http://localhost:8080/api/psychology-service/model'+'.*'),
    adminApi.getModelTotalData())
Mock.mock('http://localhost:8080/api/backstage-management-service/admin/stats',
    adminApi.getAccessData())
Mock.mock('http://localhost:8080/api/backstage-management-service/admin/mainPage/dynamic',
    adminApi.getModelUseData())

Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/police/profile'+'.*'),
    policeApi.getPersonalProfileData())
