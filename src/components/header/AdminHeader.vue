<script setup>
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import {onMounted, reactive, ref} from 'vue'
import axios from '../../api/request'
import {ElMessage} from 'element-plus'
const getImgSrc =(imgName) => {
  return new URL(`../../assets/img/${imgName}.png`, import.meta.url).href
}

onMounted(() => {
  Cookies.set('manualExit','false')
})

const router = useRouter()
const logout = ()=> {
  Cookies.set('manualExit','true')
  router.push('/login')
}

const dialogVisible = ref(false)
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
      // TODO 和后端讲他们少了个id字段 返回值也不是通用返回值
      const uploadTable = {
        'oldPassword': revisePasswordTable.value.oldPassword,
        'newPassword': revisePasswordTable.value.newPassword,
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

</script>

<template>
  <div class="header">
    <div class="l-content">
      <h1>监所警察执法保障试验平台</h1>
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
      <el-form-item prop="confirmPassword" label="请确认密码">
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
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="submit(revisePasswordTableRef)">
          确认
        </el-button>
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
  background: #A0CFFF;
  align-items: center;
  .l-content{
    color: white;
    margin-left: 1%;
  }
  .r-content{
    margin-right: 1%;
    .user-icon{
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
}
</style>
