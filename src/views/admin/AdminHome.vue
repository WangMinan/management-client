<script setup>
import AdminAside from '../../components/aside/AdminAside.vue'
import AdminHeader from '../../components/header/Header.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <AdminAside/>
      <el-container>
        <el-header>
          <AdminHeader/>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.common-layout{
  height: 100%;
  width: 100%;
}
.home-container{
  height: 100%;
  width: 100%;
}
.el-header{
  padding: 0;
}
</style>
