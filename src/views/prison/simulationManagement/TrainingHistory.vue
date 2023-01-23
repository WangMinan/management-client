<script setup>
import {onMounted, ref} from 'vue'
import axios from '../../../api/request'
import { ElMessage } from 'element-plus'

const total = ref(0)
// 请求参数的格式
const queryInfo = ref({
  police: '',
  modelName: '',
  // 当前页码
  pageNum: 1,
  pageSize: 5
})
// 获取所有模型的名称供下拉菜单使用
const modelNames = ref([])
const getModelNames = async () => {
  try{
    const {data} = await axios.get('/backstage-management-service/prison/trainDynamic')
    if(data.code !== 200){
      ElMessage.error(data.msg)
    }
    modelNames.value = data.data
  } catch (e) {
    ElMessage.error('获取模拟场景列表失败，请检查网络环境')
  }
}
const historyLoading = ref(false)
const trainingHistory = ref([{
  id: 1,
  policeId: 1,
  policeName: '',
  modelId: 1,
  modelName: '',
  startTime: '',
  endTime: '',
  status: '',
  result: ''
}])
const historyTableRef = ref()
const getTrainingHistoryList = async () => {
  historyLoading.value = true
  try{
    const {data} = await axios.get('/backstage-management-service/prison/dynamic/query',{
      params:{
        police: queryInfo.value.police,
        modelName: queryInfo.value.modelName,
        pageNum: queryInfo.value.pageNum,
        pageSize: queryInfo.value.pageSize
      }
    })
    if (data.code !== 200) {
      ElMessage.error(data.msg)
    } else {
      total.value = data.data.total
      trainingHistory.value = data.data.list
      // trainingHistory按照endTime倒序
      trainingHistory.value.sort((a, b) => {
        return new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
      })
    }
  } catch (e) {
    ElMessage.error('获取训练历史列表失败，请检查网络环境')
  } finally {
    historyLoading.value = false
  }
}

onMounted(() => {
  getModelNames()
  getTrainingHistoryList()
})

const handleSizeChange = (newSize) => {
  queryInfo.pageSize = newSize
  getTrainingHistoryList()
}
const handleCurrentChange = (newPage) => {
  queryInfo.pageNum = newPage
  getTrainingHistoryList()
}

const clearQuery = () => {
  queryInfo.value.police = ''
  queryInfo.value.modelName = ''
  getTrainingHistoryList()
}

// 查看某次场景模拟的具体信息
const checkTrainingData = ref({
  id: 1,
  policeId: 1,
  policeName: '',
  modelId: 1,
  modelName: '',
  startTime: '',
  endTime: '',
  status: '',
  result: ''
})
const checkTrainingDialogVisible = ref(false)
const showCheckDialog = (id) => {
  checkTrainingData.value = trainingHistory.value.find(item => item.id === id)
  checkTrainingDialogVisible.value = true
}
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/prison/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>场景模拟动态</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%">
    <!--搜索框-->
    <el-row class="searchRow" :gutter="15">
      <!--警员姓名Id-->
      <el-col :span = "8">
        <!--需要绑定@clear以在清空文本框时做状态更新-->
        <el-input placeholder="请输入警员编号或姓名" v-model="queryInfo.police" clearable @clear="getTrainingHistoryList">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-col>
      <!--场景名称-->
      <el-col :span = "8">
        <el-select
          v-model="queryInfo.modelName"
          filterable clearable
          placeholder="请选择模拟场景名称"
          style="width: 100%"
          @clear="getTrainingHistoryList"
        >
          <template #prefix>
            <el-icon><Menu /></el-icon>
          </template>
          <el-option
            v-for="item in modelNames"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <!--按钮区-->
      <el-col :span = "8" style="display: flex;justify-content: flex-end">
        <el-button type="primary" @click="getTrainingHistoryList">
          <el-icon><Search /></el-icon>
          <span>搜索</span>
        </el-button>
        <el-button type="info" @click="clearQuery">
          <el-icon><Refresh /></el-icon>
          <span>重置</span>
        </el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table
      style="width: 100%;"
      v-loading="historyLoading"
      :ref="historyTableRef"
      :data="trainingHistory"
      border stripe
    >
      <el-empty v-if="trainingHistory.length === 0" description="暂无数据"></el-empty>
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="policeName" label="警员姓名"></el-table-column>
      <el-table-column prop="modelName" label="场景名称"></el-table-column>
      <el-table-column prop="endTime" label="完成时间"></el-table-column>
      <el-table-column prop="status" label="模拟状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="showCheckDialog(scope.row.id)">
            <el-icon><InfoFilled /></el-icon>
            <span>查看本次模拟详情</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
        v-model:current-page="queryInfo.pageNum"
        v-model:page-size="queryInfo.pageSize"
        :page-sizes="[2, 5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
    <!--查看本次评估具体信息-->
    <el-dialog
      title="本次评估详情"
      center
      v-model="checkTrainingDialogVisible"
    >
      <el-form
          :model="checkTrainingData"
          ref="checkTrainingFormRef"
          :disabled="true"
      >
        <el-form-item label="模拟序号">
          <el-input v-model="checkTrainingData.id"></el-input>
        </el-form-item>
        <el-form-item label="场景编号">
          <el-input v-model="checkTrainingData.modelId"></el-input>
        </el-form-item>
        <el-form-item label="场景名称">
          <el-input v-model="checkTrainingData.modelName"></el-input>
        </el-form-item>
        <el-form-item label="模拟时间">
          <el-date-picker
              type="datetimerange"
              range-separator="到"
              :start-placeholder="checkTrainingData.startTime"
              :end-placeholder="checkTrainingData.endTime"
          />
        </el-form-item>
        <el-form-item label="模拟状态">
          <el-input v-model="checkTrainingData.status"></el-input>
        </el-form-item>
        <el-form-item label="模拟结果">
          <el-input type="textarea" rows="5" v-model="checkTrainingData.result"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="checkTrainingDialogVisible=false">关闭</el-button>
      </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="less" scoped>
.searchRow{
  display: flex;
  justify-content: space-between;
  .btnCol{
    display: flex;
    justify-content: flex-end;
  }
}
.el-table{
  margin-top: 2%;
}
.el-pagination{
  margin-top: 2%;
}
</style>
