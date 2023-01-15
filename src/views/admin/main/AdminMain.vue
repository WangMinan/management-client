<script setup>
import {onMounted} from 'vue'
import { useStore } from 'vuex'
const store = useStore()

onMounted(() => {
  store.commit('saveNavState','')
});
</script>

<template>
  <el-row :gutter="10">
    <el-col span="18">
      <el-card class="modal-dynamic-list">
        <template #header>
          <div class="card-header">
            <span>模型启用情况列表</span>
          </div>
        </template>
      </el-card>
    </el-col>
    <el-col span="6">

    </el-col>
  </el-row>
</template>

<style scoped>
</style>
