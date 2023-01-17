<script setup>
import {reactive, ref, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import axios from '../api/request'
import Cookies from 'js-cookie'
import {encrypt, decrypt} from "../utils/jsencrypt.js";
import { useRouter } from 'vue-router'

const router = useRouter()
const EXPIRE_DAY = 30

// ref引入 要使用vue2中的$ref需要这样引入
const loginFormRef = ref()

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const submitForm = {
  accountNumber: '',
  password: ''
}

const rules = reactive({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 1, max: 20, message: '账号长度为1-20', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 8, max: 20, message: '密码长度为8-20', trigger: 'blur'}
  ]
})

const submit = async (form) => {
  if(!form){
    return
  }
  await form.validate(async (valid, fields) => {
    if (valid) {
      await login()
    } else {
      ElMessage.error('预校验未通过,请检查输入')
    }
  })
}

const loginLoading = ref(false)

const login = async () => {
  try {
    loginLoading.value = true
    submitForm.accountNumber = loginForm.username
    submitForm.password = encrypt(loginForm.password)
    const { data } =
        await axios.post('/backstage-management-service/login', submitForm)
    if(data.code !== 200){
      ElMessage.error(data.msg)
      return
    }
    // 信息写入cookie
    if (loginForm.rememberMe) {
      Cookies.set('username', loginForm.username, {expires: EXPIRE_DAY})
      Cookies.set('password', encrypt(loginForm.password), {expires: EXPIRE_DAY})
      Cookies.set('rememberMe', loginForm.rememberMe, {expires: EXPIRE_DAY})
    } else {
      Cookies.remove('username')
      Cookies.remove('password')
      Cookies.remove('rememberMe')
    }
    // 用户信息写入sessionStorage
    sessionStorage.setItem('person', JSON.stringify(data.data.person))
    Cookies.set('role',data.data.role,{expires: EXPIRE_DAY})
    Cookies.set('accessToken', data.data.accessToken, {expires: EXPIRE_DAY})
    Cookies.set('refreshToken', data.data.refreshToken, {expires: EXPIRE_DAY})
    ElMessage.success('登录成功')
    if(data.data.role === 'admin'){
      await router.push('/admin/home')
    } else if(data.data.role === 'prison'){
      await router.push('/prison/home')
    } else {
      await router.push('/police/home')
    }
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    loginLoading.value = false
  }
}

const resetForm = (form) => {
  if(!form){
    return
  }
  form.resetFields()
}

onMounted(() => {
  if (Cookies.get('rememberMe') && Cookies.get('rememberMe') === 'true') {
    loginForm.username = Cookies.get('username')
    loginForm.password = decrypt(Cookies.get('password'))
    loginForm.rememberMe = true
    if(Cookies.get('manualExit') === 'false') {
      login()
    }
  }
})
</script>

<template>
  <div class = "login-container">
    <div class="login-banner">
      <el-row>
        <div style="margin: auto; ">
          <h1 style="color: white ">监所警察执法保障试验平台</h1>
        </div>
      </el-row>
    </div>
    <div class="login-box">
      <div class = "avatar-box">
        <img src = "/prison-logo.svg"  alt="logo">
      </div>
      <!--      label-width用于左右对齐-->
      <el-form
          label-width="0px"
          class = "login-form"
          :model="loginForm"
          ref="loginFormRef"
          :rules="rules"
          status-icon
      >
        <!--用户名 注意prop属性标注在form-item的位置-->
        <el-form-item prop="username">
          <el-input
              placeholder="请输入账号"
              v-model="loginForm.username"
          >
          <!--亲测在el-input中使用：prefix是引入不了的 只能用插槽-->
          <template #prefix>
            <el-icon class="el-input__icon">
              <User />
            </el-icon>
          </template>
          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
              placeholder="请输入密码"
              type="password"
              show-password
              v-model="loginForm.password"
          >
            <template #prefix>
              <el-icon class="el-input__icon">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <!--按钮组-->
        <el-row class="button-row" align="middle">
          <el-form-item>
            <el-checkbox
                v-model="loginForm.rememberMe"
            >
              记住我
            </el-checkbox>
          </el-form-item>
          <div class="buttons">
            <el-form-item>
              <!--          登录-->
              <el-button
                type="primary"
                @click="submit(loginFormRef)"
                :loading="loginLoading"
              >
                登录
              </el-button>
              <!--        重置-->
              <el-button type="info" @click="resetForm(loginFormRef)">重置</el-button>
            </el-form-item>
          </div>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container{
  background: url("../assets/img/bigsur.png") no-repeat fixed center;
  background-size:100% ,100%;
  height: 100%;
  .login-banner{
    //backdrop-filter: blur(20px);
    width: 500px;
    height: 80px;
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translate(-50%,-50%);
  }
  .login-box{
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar-box{
      height: 130px;
      width: 130px;
      border: 1px solid #eeee;
      border-radius: 50%;
      padding: 10px; /* 图片边框间隙 */
      background-color: white;
      box-shadow: 0 0 10px #dddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%); /* 相对自身 */
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eeee;
      }
    }
    .login-form{
      position: absolute;
      margin-top: 120px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .button-row{
        margin-top: 40px;
        justify-content: space-between;
      }
    }
  }
}
</style>
