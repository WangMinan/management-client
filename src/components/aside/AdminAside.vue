<script setup>
import {ref} from 'vue'
import {useStorage} from "@vueuse/core";

// 记住导航状态（仅本次登录期间）从sessionStorage中获取activePath
let activePath = ref('')
activePath = useStorage('activePath', null, sessionStorage)
const saveNavState = (path) => {
  // 将path存入sessionStorage
  activePath.value = path
}
</script>

<template>
  <el-aside width="15%" style="height: 100vh; background: #333D55">
    <div class="imgBox">
      <img
        class="logo"
        src="../../assets/img/prison-logo.svg"
        alt="LOGO"
      >
    </div>
    <el-menu
      class="el-menu-vertical"
      :default-active="activePath"
      router
      background-color="#333D55"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Monitor /></el-icon>
          <span>监所信息管理</span>
        </template>
        <el-menu-item
          :index="'/prisonManagement'"
          @click="saveNavState('/prisonManagement')"
        >
          <el-icon><OfficeBuilding /></el-icon>
          <span>监所管理</span>
        </el-menu-item>
        <el-menu-item
          :index="'/prisonManagerManagement'"
          @click="saveNavState('/prisonManagerManagement')"
        >
          <el-icon><User /></el-icon>
          <span>监所管理员管理</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item
        :index="'/modelManagement'"
        @click="saveNavState('/modelManagement')"
      >
        <el-icon><Menu /></el-icon>
        <span>训练模型管理</span>
      </el-menu-item>
      <el-menu-item
        :index="'/opBoard'"
        @click="saveNavState('/opBoard')"
      >
        <el-icon><Odometer /></el-icon>
        <span>平台运维看板</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style lang="less" scoped>
.imgBox{
  text-align: center;
  //border-bottom: 1px solid #e4e7ed;
  //border-right: 1px solid #e4e7ed;
  .logo{
    width: 42px;
    height: 42px;
    margin-top: 10px;
  //  将黑色的logo变成白色
    filter: invert(100%);
  }
}
</style>
