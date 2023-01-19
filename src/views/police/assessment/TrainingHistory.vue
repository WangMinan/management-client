<script setup>
import {onMounted, ref} from 'vue'
import {ElMessage} from 'element-plus'
import axios from '../../../api/request'
// 请求参数的格式
const queryInfo = ref({
  query: '',
  // 当前页码
  pageNum: 1,
  pageSize: 5
})

let total = ref(0)
const trainingHistoryData = ref([])
const historyLoading = ref(false)


const getTrainingHistory = async () => {
  historyLoading.value = true
  try{
    let resp = {}
    if(queryInfo.value.query === ''){
      resp =
          await axios.get(`/backstage-management-service/police/query/${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    } else {
      resp =
          await axios.get(`/backstage-management-service/police/query/${queryInfo.value.query}/${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    }
    const data = resp.data
    if(data.code !== 200){
      ElMessage.error(data.msg)
    } else {
      trainingHistoryData.value = data.data.list
      // trainingHistoryData按照endTime字段排序 降序
      // endTime类似于2002-06-05 19:56:50
      trainingHistoryData.value.sort((a, b) => {
        return new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
      })
      total = data.data.total
    }
  } catch (e) {
    ElMessage.error('获取模拟历史列表失败，请检查网络环境')
  } finally {
    historyLoading.value=false
  }
}

const handleSizeChange = (newSize) => {
  queryInfo.pageSize = newSize
  getTrainingHistory()
}
const handleCurrentChange = (newPage) => {
  queryInfo.pageNum = newPage
  getTrainingHistory()
}

const trainingHistoryTableRef = ref()

onMounted(() => {
  getTrainingHistory()
})

// 查看详细模拟评估部分
// 接下来是查看场景具体信息的部分
let checkTrainingDialogVisible = ref(false)

const checkTrainingData = ref({
  id: 0,
  endTime: '',
  startTime: '',
  modelId: 0,
  modelName: '',
  status: '',
  result: ''
})

const checkTrainingFormRef = ref()

const showCheckDialog = (id) => {
  checkTrainingDialogVisible.value = true
  checkTrainingData.value = trainingHistoryData.value.find(item => item.id === id)
}

const handleCheckTrainingDialogClose = () => {
  checkTrainingDialogVisible.value = false
  checkTrainingFormRef.value.resetFields()
}
</script>

<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/police/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>模拟情况查看</el-breadcrumb-item>
    <el-breadcrumb-item>模拟动态</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%">
    <!--搜索框-->
    <el-row class="searchRow">
      <el-col :span = "10">
        <!--需要绑定@clear以在清空文本框时做状态更新-->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getTrainingHistory">
          <template #append>
            <el-button @click="getTrainingHistory">
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table
      style="width: 100%"
      :data="trainingHistoryData"
      v-loading="historyLoading"
      :ref="trainingHistoryTableRef"
      border stripe
    >
      <el-empty v-if="trainingHistoryData.length === 0" description="暂无数据"></el-empty>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="modelName" label="场景名"></el-table-column>
      <el-table-column prop="startTime" label="开始时间"></el-table-column>
      <el-table-column prop="endTime" label="结束时间"></el-table-column>
      <el-table-column prop="status" label="模拟状态"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="showCheckDialog(scope.row.id)">
            <el-icon><InfoFilled /></el-icon>
            查看详细评估结果
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="queryInfo.pageNum"
      v-model:page-size="queryInfo.pageSize"
      :page-sizes="[2, 5, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <el-dialog
    title="本次评估详情"
    center
    v-model="checkTrainingDialogVisible"
    :before-close="handleCheckTrainingDialogClose"
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
