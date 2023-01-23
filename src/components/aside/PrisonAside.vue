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
      <el-menu-item
        :index="'/prison/policeManagement'"
        @click="saveNavState('/prison/policeManagement')"
      >
        <el-icon><User /></el-icon>
        <span>监所警员管理</span>
      </el-menu-item>
      <el-sub-menu
        :index="'1'"
      >
        <template #title>
          <el-icon><List /></el-icon>
          <span>场景模拟管理</span>
        </template>
        <el-menu-item
            :index="'/prison/modelManagement'"
            @click="saveNavState('/prison/modelManagement')"
        >
          <el-icon><Monitor /></el-icon>
          <span>模拟场景管理</span>
        </el-menu-item>
        <el-menu-item
            :index="'/prison/trainingHistory'"
            @click="saveNavState('/prison/trainingHistory')"
        >
          <el-icon><Calendar /></el-icon>
          <span>场景模拟动态</span>
        </el-menu-item>
        <el-menu-item
            :index="'/prison/trainingAssessment'"
            @click="saveNavState('/prison/trainingAssessment')"
        >
          <el-icon><SetUp /></el-icon>
          <span>模拟总体评估</span>
        </el-menu-item>
      </el-sub-menu>
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
