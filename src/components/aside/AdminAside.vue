<script setup>
import { useStore } from 'vuex'
const store = useStore()

// 记住导航状态（仅本次登录期间）
let activePath = store.state.navState
const saveNavState = (path) => {
  // 将path存入store
  store.commit('saveNavState', path)
}
</script>

<template>
  <el-aside width="15%">
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
    >
      <el-sub-menu
        :index="'1'"
      >
        <template #title>
          <el-icon><Monitor /></el-icon>
          <span>监所信息管理</span>
        </template>
        <el-menu-item
            :index="'/admin/prisonManagement'"
            @click="saveNavState('/admin/prisonManagement')"
        >
          <el-icon><OfficeBuilding /></el-icon>
          <span>监所管理</span>
        </el-menu-item>
        <el-menu-item
            :index="'/admin/prisonManagerManagement'"
            @click="saveNavState('/admin/prisonManagerManagement')"
        >
          <el-icon><User /></el-icon>
          <span>监所管理员管理</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item
        :index="'/admin/modelManagement'"
        @click="saveNavState('/admin/modelManagement')"
      >
        <el-icon><Menu /></el-icon>
        <span>模拟场景管理</span>
      </el-menu-item>
      <el-menu-item
        :index="'/admin/opBoard'"
        @click="saveNavState('/admin/opBoard')"
      >
        <el-icon><Odometer /></el-icon>
        <span>监所情况看板</span>
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
  }
}
</style>
