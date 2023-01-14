<script setup>
import {ref} from 'vue'

// ref引入 要使用vue2中的$ref需要这样引入
const loginFormRef = ref()

const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false
})

const resetForm = (form) => {
  if(!form){
    return
  }
  form.resetFields()
}

</script>

<template>
  <div class = "login-container">
    <div class="login-banner">
      <el-row>
        <div style="margin: auto; ">
          <h1 style="color: white ">欢迎使用监所管理系统</h1>
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
      >
        <!--        用户名 注意prop属性标注在form-item的位置-->
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
        <!--        密码-->
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
        <el-row class="button-row">
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
              <el-button type="primary" >登录</el-button>
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
  background: url("../assets/bigsur.png") no-repeat fixed center;
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
        margin-bottom: 10px;
        justify-content: space-between;
      }
    }
  }
}
</style>
