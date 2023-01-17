<script setup>
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import {onMounted, reactive, ref} from 'vue'
import axios from '../../api/request'
import {ElLoading, ElMessage} from 'element-plus'
import { useStore } from 'vuex'
import { encrypt } from '../../utils/jsencrypt.js'

const store = useStore()

const getImgSrc =(imgName) => {
  return new URL(`../../assets/img/${imgName}.png`, import.meta.url).href
}

onMounted(() => {
  Cookies.set('manualExit','false')
})

const router = useRouter()
const logout = async ()=> {
  // 从store中删除路由数据
  store.commit('saveNavState','')
  Cookies.set('manualExit','true')
  // 使用服务方式调用loading全局遮罩 禁用操作
  const loading = ElLoading.service({
    lock: true,
    text: '正在清除登录状态',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try{
    await axios.post('/backstage-management-service/logout')
  } catch (e) {
    ElMessage.error('后端服务器异常,将强制退出')
  } finally {
    loading.close()
    await router.push('/login')
  }
}

let dialogVisible = ref(false)
const revisePasswordTableRef=ref()
const revisePasswordTable = ref({
  'oldPassword': '',
  'newPassword': '',
  'confirmPassword':''
})

const validateOldPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入旧密码'))
  } else {
    if (value.length < 8 || value.length > 20) {
      callback(new Error('密码长度为8-20'))
    } else {
      callback()
    }
  }
}

const validateNewPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (value.length < 8 || value.length > 20) {
      callback(new Error('密码长度为8-20'))
    } else {
      callback()
    }
  }
}

const validateConfirmPass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else {
    if (value.length < 8 || value.length > 20) {
      callback(new Error('密码长度为8-20'))
    } else {
      if (value !== revisePasswordTable.value.newPassword) {
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
        'oldPassword': encrypt(revisePasswordTable.value.oldPassword),
        'newPassword': encrypt(revisePasswordTable.value.newPassword)
      }
      const {data} = await axios.put('/backstage-management-service/account/password',uploadTable)
      if(data.code === 200){
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

const nickName = ref(
    (JSON.parse(sessionStorage.getItem('person'))).nickname ||
    (JSON.parse(sessionStorage.getItem('person'))).name
)

</script>

<template>
  <div class="header">
    <div class="l-content">
      <h1 v-if="Cookies.get('role') === 'admin'">
        监所警察执法保障试验平台——运维端,欢迎您:{{nickName}}
      </h1>
      <h1 v-else-if="Cookies.get('role') === 'prison'">
        监所警察执法保障试验平台——监狱端,欢迎您:{{nickName}}
      </h1>
      <h1 v-else-if="Cookies.get('role') === 'police'">
        监所警察执法保障试验平台——警员端,欢迎您:{{nickName}}
      </h1>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="user-icon" :src="getImgSrc('user')" alt="logo">
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="dialogVisible=true">修改密码</el-dropdown-item>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!--修改密码弹框-->
  <el-dialog
    style="width: 50%"
    v-model="dialogVisible"
    center
    title="修改密码"
    @close="resetForm(revisePasswordTableRef)"
  >
    <el-form
      :model="revisePasswordTable"
      label-width="15%"
      status-icon
      ref="revisePasswordTableRef"
      :rules="rules"
    >
      <el-form-item prop="oldPassword" label="请输入旧密码">
        <el-input
          v-model="revisePasswordTable.oldPassword"
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
            v-model="revisePasswordTable.newPassword"
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
      <el-form-item prop="confirmPassword" label="请确认新密码">
        <el-input
            v-model="revisePasswordTable.confirmPassword"
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
        <el-button type="primary" @click="submit(revisePasswordTableRef)">
          确认
        </el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
.header{
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: #79BBFF;
  align-items: center;
  .l-content{
    color: white;
    margin-left: 1%;
  }
  .r-content{
    display: flex;
    margin-right: 1%;
    .user-icon{
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
}
</style>
