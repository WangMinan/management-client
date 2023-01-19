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
        :index="'/police/training'"
        @click="saveNavState('/police/training')"
      >
        <el-icon><GoldMedal /></el-icon>
        <span>模拟场景选择</span>
      </el-menu-item>
      <el-sub-menu
        :index="'1'"
      >
        <template #title>
          <el-icon><List /></el-icon>
          <span>模拟情况查看</span>
        </template>
        <el-menu-item
          :index="'/police/trainingHistory'"
          @click="saveNavState('/police/trainingHistory')"
        >
          <el-icon><Calendar /></el-icon>
          <span>模拟动态</span>
        </el-menu-item>
        <el-menu-item
          :index="'/police/psychoAssessment'"
          @click="saveNavState('/police/psychoAssessment')"
        >
          <el-icon><DataLine /></el-icon>
          <span>心理综合评估结果</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item
          :index="'/police/personalProfile'"
          @click="saveNavState('/police/personalProfile')"
      >
        <el-icon><User /></el-icon>
        <span>个人信息维护</span>
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
