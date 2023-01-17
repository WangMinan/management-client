<script setup>
import {useRouter} from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="notFoundBox">
    <h1>404,您访问的页面不存在</h1>
    <el-button @click="router.push('/login')">回到登录页面</el-button>
  </div>
</template>

<style scoped>
.notFoundBox{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
