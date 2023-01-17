<script setup>
console.log(navigator.platform)
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>平台运维看板</el-breadcrumb-item>
  </el-breadcrumb>
  <el-row :gutter="15">
    <el-col :span="8">
      <el-card></el-card>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.el-row{
  margin-top: 1%;
}
</style>
