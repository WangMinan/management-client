<script setup>
import {onMounted, reactive, ref} from 'vue'
import {ElMessage, ElNotification} from 'element-plus'
import axios from '../api/request'
import Cookies from 'js-cookie'
import {encrypt} from "../utils/jsencrypt.js";
import {useRouter} from 'vue-router'

const router = useRouter()
const EXPIRE_DAY = 30
const EXPIRE_ACCESS_TOKEN = 30
const EXPIRE_REFRESH_TOKEN = 7
const APP_NAME = import.meta.env.VITE_APP_NAME

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
    {min: 4, max: 20, message: '密码长度为4-20', trigger: 'blur'}
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
  if(!confirmCookieStrategy.value){
    ElMessage.error('请先同意我们的cookie策略')
    return
  }
  try {
    loginLoading.value = true
    submitForm.accountNumber = loginForm.username
    submitForm.password = encrypt(loginForm.password)
    const { data } =
        await axios.post('/backstage-management-service/login', submitForm)
    if(data.code !== 2000){
      ElMessage.error(data.msg)
      return
    }
    // 信息写入cookie
    if (loginForm.rememberMe) {
      Cookies.set('rememberMe', loginForm.rememberMe, {expires: EXPIRE_DAY})
    } else {
      Cookies.remove('rememberMe')
    }
    // 用户信息写入sessionStorage
    Cookies.set('person', JSON.stringify(data.data.person), {expires: EXPIRE_DAY})
    Cookies.set('role',data.data.role,{expires: EXPIRE_DAY})
    const millisecond = new Date().getTime();
    // 过期时间30min
    const expiresTime = new Date(millisecond + 60 * 1000 * EXPIRE_ACCESS_TOKEN);
    Cookies.set('accessToken', data.data.accessToken, {expires: expiresTime})
    Cookies.set('refreshToken', data.data.refreshToken, {expires: EXPIRE_REFRESH_TOKEN})
    ElMessage.success('登录成功')
    if(data.data.role === 'Admin'){
      await router.push('/admin/home')
    } else if(data.data.role === 'PrisonAdmin'){
      await router.push('/prison/home')
    } else {
      await router.push('/police/home')
    }
  } catch (e) {
    // ElMessage.error(e.message)
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

// 校验浏览器版本 高级的await属性需要chrome > 89, safari > 15 建议使用chromium内核的浏览器
const checkBrowserVersion = () => {
  const ua = navigator.userAgent.toLowerCase()
  const isChrome = ua.indexOf('chrome') !== -1
  const isSafari = ua.indexOf('safari') !== -1
  const isFirefox = ua.indexOf('firefox') !== -1
  if (isChrome) {
    const chromeVersion = ua.match(/chrome\/([\d.]+)/)[1]
    if (parseInt(chromeVersion.split('.')[0]) < 89) {
      ElNotification({
        title: '兼容性问题',
        message: '您的浏览器可能无法正常使用全部功能。我们推荐您使用' +
            '<a href="https://www.google.com/chrome" style="text-decoration: none;color: black">' +
            '89及以上版本的Chrome浏览器' +
            '</a>' +
            '以完整地使用我们的功能。',
        type: 'warning',
      })
    }
  } else if (isSafari) {
    const safariVersion = ua.match(/version\/([\d.]+)/)[1]
    if (parseInt(safariVersion.split('.')[0]) < 15) {
      ElNotification({
        title: '兼容性问题',
        message: '您的浏览器可能无法正常使用全部功能。我们推荐您使用' +
            '<a href="https://www.apple.com/safari/" style="text-decoration: none;color: black">' +
            '15及以上版本的Safari浏览器' +
            '</a>' +
            '以完整地使用我们的功能。',
        type: 'warning',
      })
    }
  } else if (isFirefox) {
    ElNotification({
      title: '兼容性问题',
      dangerouslyUseHTMLString: true,
      message: '您的浏览器可能无法正常使用全部功能。我们推荐您使用' +
          '<a href="https://www.google.com/chrome" style="text-decoration: none;color: black">' +
          '89及以上版本的Chrome浏览器' +
          '</a>' +
          '以完整地使用我们的功能。',
      type: 'warning',
    })
  }
}

onMounted(async () => {
  checkConfirmStrategy()
  checkBrowserVersion()
  if (Cookies.get('rememberMe') !== undefined &&
      Cookies.get('manualExit') !== undefined &&
      Cookies.get('role') !== undefined &&
      Cookies.get('person') !== undefined
  ) {
    if (Cookies.get('manualExit') === 'false' &&
        Cookies.get('rememberMe') === 'true'
    ) {
      if (Cookies.get('role') === 'Admin') {
        await router.push('/admin/home')
      } else if (Cookies.get('role') === 'PrisonAdmin') {
        await router.push('/prison/home')
      } else {
        await router.push('/police/home')
      }
    }
  }
})

const confirmCookieStrategy = ref(false)
const confirmStrategyDialogVisible = ref(false)
const checkConfirmStrategy = () => {
  if(window.localStorage.getItem('confirmCookieStrategy') !== undefined){
    if(window.localStorage.getItem('confirmCookieStrategy') === 'true') {
      confirmCookieStrategy.value = true
      return
    }
  }
  ElNotification({
    title: '请先确认我们的Cookie策略',
    message: '点击此通知的任意位置来查看我们的Cookie策略',
    duration: 0,
    type: 'warning',
    onClick: () => {
      confirmStrategyDialogVisible.value = true
    }
  })
}
const confirmStrategy = () => {
  window.localStorage.setItem('confirmCookieStrategy', 'true')
  confirmStrategyDialogVisible.value = false
  confirmCookieStrategy.value = true
  ElNotification.closeAll()
  ElMessage.success('您已同意我们的Cookie策略,请继续登录')
}
const refuseStrategy = () => {
  window.localStorage.setItem('confirmCookieStrategy', 'false')
  confirmStrategyDialogVisible.value = false
  confirmCookieStrategy.value = false
  ElMessage.error('您拒绝了我们的Cookie策略,将无法登录,请重新查看策略或退出本页面')
}
</script>

<template>
  <div class = "login-container">
    <div class="login-banner">
      <el-row>
        <div style="margin: auto; ">
          <h1 style="color: white ">{{ APP_NAME }}</h1>
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
            @keyup.enter.native="submit(loginFormRef)"
          >
            <!-- 这个keyup放在btn上不生效 怀疑是tooltip做了某些覆盖 -->
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
              @keyup.enter.native="submit(loginFormRef)"
            >
              记住我
            </el-checkbox>
          </el-form-item>
          <div class="buttons">
            <el-form-item>
              <el-tooltip
                class="box-item"
                effect="light"
                content="请确认我们的Cookie政策"
                placement="bottom"
                :disabled="confirmCookieStrategy"
              >
                <!--登录-->
                <el-button
                  type="primary"
                  @click="submit(loginFormRef)"
                  :loading="loginLoading"
                >
                  登录
                </el-button>
              </el-tooltip>
              <!--重置-->
              <el-button type="info" @click="resetForm(loginFormRef)">重置</el-button>
            </el-form-item>
          </div>
        </el-row>
      </el-form>
    </div>
  </div>
  <el-dialog
    title="我们的Cookie策略"
    v-model="confirmStrategyDialogVisible"
    center
  >
    <el-card>
      <p>我们使用本地存储记录的信息如下</p>
      <ul>
        <li>您是否确认了本策略通知</li>
        <li>您对明亮模式和暗黑模式的选择状态</li>
      </ul>
      <p>我们将使用Cookie记录的信息如下</p>
      <ul>
        <li>您的确认登录的状态</li>
        <li>您的用户角色信息</li>
        <li>您的具体信息,根据角色不同包括:昵称、所属监所、个人头像链接、是否正在模拟中等</li>
        <li>您的登录用唯一标识符</li>
      </ul>
      <p>如果您选择了 ' 记住我 ' , 则Cookie中不会记录额外信息</p>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirmStrategy">
          同意
        </el-button>
        <el-button @click="refuseStrategy">拒绝</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.login-container{
  background: url("../assets/img/linebackground.webp") no-repeat fixed center;
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
