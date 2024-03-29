<script setup>
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import {onMounted, reactive, ref, watch} from 'vue'
import axios from '../../api/request'
import {ElLoading, ElMessage} from 'element-plus'
import { useStore } from 'vuex'
import { encrypt } from '../../utils/jsencrypt.js'

const store = useStore()
const APP_NAME = import.meta.env.VITE_APP_NAME

const getImgSrc =(imgName) => {
  return new URL(`../../assets/img/${imgName}.png`, import.meta.url).href
}

onMounted(() => {
  Cookies.set('manualExit','false',{expires: 30})
})

const router = useRouter()
const logout = async ()=> {
  // 从store中删除路由数据
  store.commit('saveNavState','')
  Cookies.set('manualExit','true',{expires: 30})
  // 使用服务方式调用loading全局遮罩 禁用操作
  const loading = ElLoading.service({
    lock: true,
    text: '正在清除登录状态',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try{
    const {data} = await axios.post('/backstage-management-service/logout')
    if(data.code !== 2000){
      ElMessage.error(data.msg)
    }
  } catch (e) {
    ElMessage.error('后端服务器异常,将强制退出')
  } finally {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    loading.close()
    await router.push('/login')
  }
}

let dialogVisible = ref(false)
const revisePasswordFormRef=ref()
const revisePasswordForm = ref({
  'oldPassword': '',
  'newPassword': '',
  'confirmPassword':''
})

const validateOldPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入旧密码'))
  } else {
    if (value.length < 4 || value.length > 20) {
      callback(new Error('密码长度为4-20'))
    } else {
      callback()
    }
  }
}

const validateNewPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (value.length < 4 || value.length > 20) {
      callback(new Error('密码长度为4-20'))
    } else {
      callback()
    }
  }
}

const validateConfirmPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else {
    if (value.length < 4 || value.length > 20) {
      callback(new Error('密码长度为4-20'))
    } else {
      if (value !== revisePasswordForm.value.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
  }
}

// 注意：validator需要定义在rules之前 否则报cannot access 'validateOldPass' before initialization
const rules = reactive({
  oldPassword: [{ validator: validateOldPass, trigger: 'blur' }],
  newPassword: [{ validator: validateNewPass, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPass, trigger: 'blur' }],
})

const resetForm = (form) => {
  if(!form){
    return
  }
  form.resetFields()
}

// 修改密码请求
const submit = async (form) => {
  if(!form){
    return
  }
  await form.validate(async (valid, fields) => {
    if (valid) {
      const uploadTable = {
        'oldPassword': encrypt(revisePasswordForm.value.oldPassword),
        'newPassword': encrypt(revisePasswordForm.value.newPassword)
      }
      const {data} = await axios.put('/backstage-management-service/account/password',uploadTable)
      if(data.code === 2000){
        ElMessage.success('修改成功')
        dialogVisible.value = false
        resetForm(form)
      }else{
        ElMessage.error(data.msg)
      }
    } else {
      ElMessage.error('预校验未通过,请检查输入')
    }
  })
}

const nickname = ref(
    (JSON.parse(Cookies.get('person'))).nickname ||
    (JSON.parse(Cookies.get('person'))).name
)

const imageUrl = ref(
    (JSON.parse(Cookies.get('person'))).imageUrl ||
    getImgSrc('user')
)
// 修改昵称请求
let reviseNicknameDialogVisible = ref(false)
const reviseNicknameFormRef = ref()
const reviseNicknameData = ref({
  'nickname': ''
})
const reviseNicknameRules = reactive({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ]
})
const reviseNicknameSubmit = (form) => {
  if(!form){
    return
  }
  form.validate(async (valid, fields) => {
    if (valid) {
      const prisonAdminId = (JSON.parse(Cookies.get('person'))).id
      const {data} = await axios.put(`/backstage-management-service/prison/${prisonAdminId}`,
          reviseNicknameData.value)
      if(data.code === 2000){
        ElMessage.success('修改成功')
        reviseNicknameDialogVisible.value = false
        nickname.value = reviseNicknameData.value.nickname
        resetForm(form)
      }else{
        ElMessage.error(data.msg)
      }
    } else {
      ElMessage.error('预校验未通过,请检查输入')
    }
  })
}

// 为暗黑模式启用支持
import {useDark, useStorage, useToggle} from '@vueuse/core'

const dark = ref(
      window.localStorage.getItem('vueuse-color-scheme') === 'dark'
)
const isDark = useDark()
const toggleDark = useToggle(isDark)
const changeTheme = () => {
  dark.value = !dark.value
  toggleDark()
}

/*const policeChange = useStorage('policeChange', 'false')
watch(policeChange, () => {
  // 重新设置
  nickname.value = (JSON.parse(Cookies.get('person'))).nickname ||
      (JSON.parse(Cookies.get('person'))).name
  imageUrl.value = (JSON.parse(Cookies.get('person'))).imageUrl ||
      getImgSrc('user')
  window.localStorage.setItem('policeChange', 'false')
})*/
</script>

<template>
  <div class="header">
    <div class="l-content">
      <h1 v-if="Cookies.get('role') === 'Admin'">
        {{ APP_NAME }}——运维端,欢迎您:{{nickname}}
      </h1>
      <h1 v-else-if="Cookies.get('role') === 'PrisonAdmin'">
        {{ APP_NAME }}——监所端,欢迎您:{{nickname}}
      </h1>
      <h1 v-else-if="Cookies.get('role') === 'Police'">
        {{ APP_NAME }}——警员端,欢迎您:{{nickname}}
      </h1>
    </div>
    <div class="flex-grow"></div>
    <div class="r-content">
      <el-row :gutter="15">
        <el-col :span="18">
          <el-button v-if="!dark" @click="changeTheme" style="background:#409EFF; color: white">
            <el-icon><Sunny/></el-icon>
            <span>明亮模式</span>
          </el-button>
          <el-button v-else @click="changeTheme" style="background: #303133;color: white">
            <el-icon><Moon/></el-icon>
            <span>暗黑模式</span>
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-dropdown>
            <span class="el-dropdown-link">
              <img v-if="Cookies.get('role') === 'Police'" :src="imageUrl" class="user-icon" alt="LOGO">
              <img v-else class="user-icon" :src="getImgSrc('user')" alt="logo">
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="Cookies.get('role') === 'PrisonAdmin'" @click="reviseNicknameDialogVisible=true">
                  <span>修改昵称</span>
                </el-dropdown-item>
                <el-dropdown-item @click="dialogVisible=true">
                  <span>修改密码</span>
                </el-dropdown-item>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
  </div>
  <!--修改密码弹框-->
  <el-dialog
    style="width: 50%"
    v-model="dialogVisible"
    center
    title="修改密码"
    @close="resetForm(revisePasswordFormRef)"
  >
    <el-form
      :model="revisePasswordForm"
      label-width="15%"
      status-icon
      ref="revisePasswordFormRef"
      :rules="rules"
    >
      <el-form-item prop="oldPassword" label="请输入旧密码">
        <el-input
          v-model="revisePasswordForm.oldPassword"
          placeholder="旧密码"
          type="password"
          show-password
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="newPassword" label="请输入新密码">
        <el-input
            v-model="revisePasswordForm.newPassword"
            placeholder="新密码"
            type="password"
            show-password
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" label="请确认新密码">
        <el-input
            v-model="revisePasswordForm.confirmPassword"
            placeholder="确认密码"
            type="password"
            show-password
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit(revisePasswordFormRef)">
          确认
        </el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <!--修改昵称弹框-->
  <el-dialog
    style="width: 50%"
    v-model="reviseNicknameDialogVisible"
    center
    title="修改昵称"
    @close="resetForm(reviseNicknameFormRef)"
  >
    <el-form
      :model="reviseNicknameData"
      label-width="15%"
      status-icon
      ref="reviseNicknameFormRef"
      :rules="reviseNicknameRules"
    >
      <el-form-item prop="nickname" label="新昵称">
        <el-input
          v-model="reviseNicknameData.nickname"
          placeholder="请输入新昵称"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <User />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="reviseNicknameSubmit(reviseNicknameFormRef)">
          确认
        </el-button>
        <el-button @click="reviseNicknameDialogVisible=false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.header{
  display: flex;
  width: 100%;
  height: 100%;
  background: #79BBFF;
  align-items: center;
  .l-content{
    color: white;
    margin-left: 1%;
  }
  .flex-grow {
    flex-grow: 1;
  }
  .r-content{
    padding: 0 10px;
    .user-icon{
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
}
</style>
