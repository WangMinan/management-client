<script setup>
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import {onMounted} from 'vue'

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
            <el-dropdown-item>个人信息维护</el-dropdown-item>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header{
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background: #409EFF;
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
