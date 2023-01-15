import Mock from 'mockjs'
import loginApi from './mockdata/login.js'
import adminApi from './mockdata/admin/admin.js'
// 拦截请求
Mock.mock('http://localhost:8080/api/backstage-management-service/login',
    loginApi.getLoginData())
Mock.mock('http://localhost:8080/api/backstage-management-service/account/password',
    adminApi.getRevisePasswordData())
Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/admin/prison'+'.*'),
    adminApi.getPrisonTotalData())
// Mock.mock(RegExp('http://localhost:8080/api/backstage-management-service/admin/padmin'+'.*'),
//     adminApi.getPrisonManagerTotalData())
