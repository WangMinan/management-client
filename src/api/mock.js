import Mock from 'mockjs'
import loginApi from './mockdata/login.js'
// 拦截请求
Mock.mock('http://localhost:8080/api/backstage-management-service/login', loginApi.getLoginData())
