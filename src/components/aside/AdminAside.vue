<script setup>
import {ref} from 'vue'
</script>

<template>
  <el-aside width="15%" style="height: 100vh; background: #333D55">
    <div class="imgBox">
      <img
        class="logo"
        src="../../assets/prison-logo.svg"
        alt="LOGO"
      >
    </div>
    <el-menu
        class="el-menu-vertical-demo"
        default-active="1"
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
        >
          <el-icon><OfficeBuilding /></el-icon>
          <span>监所管理</span>
        </el-menu-item>
        <el-menu-item
          :index="'/prisonManagerManagement'"
        >
          <el-icon><User /></el-icon>
          <span>监所管理员管理</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item
        :index="'/modelManagement'"
      >
        <el-icon><Menu /></el-icon>
        <span>训练模型管理</span>
      </el-menu-item>
      <el-menu-item
        :index="'/opBoard'">
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
