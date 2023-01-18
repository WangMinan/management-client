<script setup>
import {ref, onMounted, stop} from 'vue'
import axios from "../../../api/request.js";
import {ElLoading, ElMessage} from "element-plus";
// 保存表格中的监狱数据
const modelData = ref([])
// 表格的加载圈
const modelLoading = ref(false)
// 请求参数的格式
const queryInfo = ref({
  query: '',
  // 当前页码
  pageNum: 1,
  pageSize: 5
})

const modelTableRef = ref()
const total = ref(0)

const stateFormat =  (row, column, cellValue) => {
  if (!cellValue) return ''
  if (cellValue.length > 20) {
    // 最多显示20个字符
    return cellValue.slice(0, 20) + '...'
  }
  return cellValue
}
const getModelList = async () => {
  try{
    modelLoading.value=true
    let resp = {}
    if(queryInfo.value.query === ''){
      resp =
          await axios.get(`/psychology-service/model/${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    } else {
      resp =
          await axios.get(`/psychology-service/model/${queryInfo.value.query}/${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    }
    const data = resp.data
    if(data.code !== 200){
      ElMessage.error(data.msg)
    }
    modelData.value = data.data.list
    // 将modalData中的数据按照priority进行从小到大排序
    modelData.value.sort((a,b) => a.priority - b.priority)
    total.value = data.data.total
    // modelData.value = adminApi.getModelTotalData().data.list
    // total.value = adminApi.getModelTotalData().data.total
  } catch (e) {
    console.log(e)
    ElMessage.error('获取训练模型列表失败，请检查网络环境')
  } finally {
    modelLoading.value=false
  }
}

const handleSizeChange = (newSize) => {
  queryInfo.pageSize = newSize
  getModelList()
}
const handleCurrentChange = (newPage) => {
  queryInfo.pageNum = newPage
  getModelList()
}

// 接下来是查看模型具体信息的部分
let checkModelDialogVisible = ref(false)

const checkModelData = ref({
  name: '',
  description: '',
  enable: true,
  priority: 0
})

const checkModelFormRef = ref()

const showCheckDialog = (id) => {
  checkModelDialogVisible.value = true
  const tmpModel = modelData.value.find(item => item.id === id)
  checkModelData.value = {
    name: tmpModel.name,
    description: tmpModel.description,
    enable: tmpModel.enable,
    priority: tmpModel.priority
  }
}

const handleCheckModelDialogClose = () => {
  checkModelDialogVisible.value = false
  checkModelFormRef.value.resetFields()
}

const startTraining = async (id) => {
  let loading
  modelLoading.value = true
  try {
    const {data} = await axios.post(`/psychology-service/training/${id}`)
    if (data.code !== 200) {
      ElMessage.error(data.msg)
    } else {
      ElMessage.success('启动训练成功')
      const currentTime = new Date().getTime()
      // 结束时间为开始后一个小时
      const stopTime = currentTime + 3600 * 1000
      // 使用服务调用全局遮罩
      loading = ElLoading.service({
        lock: true,
        text: '正在训练中，您的训练结束时间为' + new Date(stopTime).toLocaleString(),
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
  } catch (e) {
    ElMessage.error('启动训练失败，请检查网络环境')
  } finally {
    modelLoading.value = false
  }
  // 等待一小时后关闭遮罩
  setTimeout(() => {
    loading.close()
  }, 3600 * 1000)
}
onMounted(() => {
  getModelList()
})
</script>

<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/police/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>训练项目选择</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%">
    <!--搜索框-->
    <el-row class="searchRow">
      <el-col :span = "10">
        <!--需要绑定@clear以在清空文本框时做状态更新-->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getModelList">
          <template #append>
            <el-button @click="getModelList">
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
        style="width: 100%;"
        v-loading="modelLoading"
        :ref="modelTableRef"
        :data="modelData"
        border stripe
    >
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="模型名称"></el-table-column>
      <el-table-column label="是否启用">
        <template #default="scope">
          <el-switch
              v-model="scope.row.enable"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
              :disabled="true"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级"></el-table-column>
      <el-table-column prop="description" label="描述" :formatter="stateFormat"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-tooltip effect="light" content="模型具体信息查看" placement="top" :enterable="false">
            <el-button type="success" circle size="small" @click="showCheckDialog(scope.row.id)">
              <el-icon><InfoFilled /></el-icon>
            </el-button>
          </el-tooltip>
          <el-button type="primary" size="small" @click="startTraining(scope.row.id)">
            <el-icon><Opportunity /></el-icon>
            开始训练
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
  </el-card>
  <!--查看模型具体信息弹窗-->
  <el-dialog
      title="模型信息"
      v-model="checkModelDialogVisible"
      center
      :before-close="handleCheckModelDialogClose"
  >
    <el-form :model="checkModelData" ref="checkModelFormRef">
      <el-form-item label="模型名称">
        <el-input v-model="checkModelData.name" placeholder="请输入模型名称" disabled>
          <template #prefix>
            <el-icon><Menu /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
            v-model="checkModelData.enable"
            inline-prompt
            active-text="启用"
            inactive-text="禁用"
            disabled
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="优先级别">
        <el-tooltip
            effect="light"
            content="数字越小(-65525~65535),优先级越高"
            placement="bottom"
        >
          <el-input-number v-model="checkModelData.priority" :min="-65535" :max="65535" :step="1" disabled></el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="模型描述">
        <el-input type="textarea" maxlength="255" rows="5" v-model="checkModelData.description" show-word-limit disabled>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="checkModelDialogVisible=false">关闭</el-button>
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
