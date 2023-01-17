<script setup>
import PoliceAside from '../../components/aside/PoliceAside.vue'
import PoliceHeader from '../../components/header/Header.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <PoliceAside/>
      <el-container>
        <el-header>
          <PoliceHeader/>
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
