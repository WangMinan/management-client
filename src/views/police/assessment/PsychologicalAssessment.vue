<script setup>
import {onMounted, ref} from 'vue'
import {ElMessage} from 'element-plus'
import axios from '../../../api/request'

const assessmentData = ref({})

const assessmentLoading = ref(false)

const getAssessmentData = async() => {
  assessmentLoading.value = true
  try {
    const {data}= await axios.get('/backstage-management-service/police/totalResult')
    if(data.code !== 200){
      ElMessage.error(data.msg)
    } else {
      assessmentData.value = data.data
      console.log()
    }
  } catch (e) {
    ElMessage.error('获取评估数据失败')
  } finally {
    assessmentLoading.value = false
  }
}

onMounted(() => {
  getAssessmentData()
})
</script>

<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/police/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>模拟情况查看</el-breadcrumb-item>
    <el-breadcrumb-item>心理综合评估结果</el-breadcrumb-item>
  </el-breadcrumb>
  <el-row :gutter="15">
    <el-col :span="12">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Sunny /></el-icon>
            <span>心理状态</span>
          </div>
        </template>
        {{assessmentData.mindStatus}}
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Stopwatch /></el-icon>
            <span>压力类型</span>
          </div>
        </template>
        {{assessmentData.pressureType}}
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.el-row{
  margin-top: 2%;
  text-align: center;
  .card-header{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    .el-icon{
      font-size: 20px;
      color: #409EFF;
    }
  }
}
</style>
