<script setup>
import {ref, onMounted, stop, onBeforeUnmount} from 'vue'
import axios from '../../../api/request.js'
import {ElLoading, ElMessage} from 'element-plus'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

const router = useRouter()

// 保存表格中的场景数据
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
    const {data} = await axios.get('/backstage-management-service/model',{
      params: {
        query: queryInfo.value.query,
        pageNum: queryInfo.value.pageNum,
        pageSize: queryInfo.value.pageSize
      }
    })
    if(data.code !== 2000){
      ElMessage.error(data.msg)
    } else {
      modelData.value = data.data.list
      // 将modalData中的数据按照priority进行从小到大排序
      modelData.value.sort((a,b) => a.priority - b.priority)
      total.value = data.data.total
    }
  } catch (e) {
    ElMessage.error('获取模拟场景列表失败，请检查网络环境')
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

// 接下来是查看场景具体信息的部分
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

// 模拟部分
const currentTrainingId = ref(0)
const currentTrainingModelName = ref('')
const trainingDialogVisible = ref(false)
const currentTrainingHour = ref(0)
const currentTrainingMinute = ref(0)
const currentTrainingSecond = ref(0)
const currentTrainingMillisecond = ref(0)
const startTraining = async (id) => {
  try {
    const {data} = await axios.post(`/backstage-management-service/training/${id}`)
    if (data.code !== 2000) {
      ElMessage.error(data.msg)
    } else {
      currentTrainingId.value = data.data
      const trainingDetail = {
        policeId: (JSON.parse(Cookies.get('person'))).id,
        currentTrainingId: currentTrainingId.value
      }
      window.localStorage.setItem('trainingStatus', JSON.stringify(trainingDetail))
      currentTrainingModelName.value = modelData.value.find(item => item.id === id).name
      // 弹出模拟框
      trainingDialogVisible.value = true
      startCountUp()
      ElMessage.success('启动模拟成功')
    }
  } catch (e) {
    ElMessage.error('启动模拟失败，请检查网络环境')
  }
}
let timer = null
const startCountUp = () => {
  // 每间隔10毫秒刷新一次currentTrainingMillisecond currentTrainingSecond currentTrainingMinute currentTrainingHour
  timer = setInterval(() => {
    currentTrainingMillisecond.value += 10
    if (currentTrainingMillisecond.value >= 1000) {
      currentTrainingMillisecond.value = 0
      currentTrainingSecond.value += 1
    }
    if (currentTrainingSecond.value >= 60) {
      currentTrainingSecond.value = 0
      currentTrainingMinute.value += 1
    }
    if (currentTrainingMinute.value >= 60) {
      currentTrainingMinute.value = 0
      currentTrainingHour.value += 1
    }
  }, 10);
}

// 暂停/继续模拟
const isPause = ref(false)
const pauseBtnLoading = ref(false)
const pauseOrContinueTraining = async () => {
  try{
    pauseBtnLoading.value = true
    if (isPause.value){
      startCountUp()
    } else {
      stopCountUp()
    }
    isPause.value = !isPause.value
    // 向window.localStorage中写入暂停/继续的状态
    const trainingDetail = {
      policeId: (JSON.parse(Cookies.get('person'))).id,
      currentTrainingId: currentTrainingId.value,
      currentTrainingMillisecond: currentTrainingMillisecond.value,
      currentTrainingSecond: currentTrainingSecond.value,
      currentTrainingMinute: currentTrainingMinute.value,
      currentTrainingHour: currentTrainingHour.value
    }
    window.localStorage.setItem('trainingStatus', JSON.stringify(trainingDetail))
    const {data} = await axios.put(`/backstage-management-service/training/${currentTrainingId.value}`)
    if (data.code !== 2000) {
      ElMessage.error(data.msg)
    } else {
      if(isPause.value){
        ElMessage.success('暂停模拟成功')
      } else {
        ElMessage.success('继续模拟成功')
      }
    }
  } catch (e) {
    ElMessage.error('暂停/继续模拟失败，请检查网络环境')
  } finally {
    pauseBtnLoading.value = false
  }
}

const stopCountUp = () => {
  // 停止计时
  clearInterval(timer)
}

// 停止模拟
const stopBtnLoading = ref(false)
const stopTraining = async () => {
  stopBtnLoading.value = true
  try{
    const {data} = await axios.get(`/backstage-management-service/training/${currentTrainingId.value}`)
    if (data.code !== 2000) {
      ElMessage.error(data.msg)
    } else {
      window.localStorage.removeItem('trainingStatus')
      trainingDialogVisible.value = false
      currentTrainingHour.value = 0
      currentTrainingMinute.value = 0
      currentTrainingSecond.value = 0
      ElMessage.success('结束模拟成功, 请在模拟记录中查看模拟结果')
    }
  } catch (e) {
    ElMessage.error('结束模拟失败，请检查网络环境')
  } finally {
    stopBtnLoading.value = false
  }
}

// 取消模拟
const cancelBtnLoading = ref(false)
const cancelTraining = async () => {
  cancelBtnLoading.value = true
  try{
    const {data} = await axios.delete(`/backstage-management-service/training/${currentTrainingId.value}`)
    if (data.code !== 2000) {
      ElMessage.error(data.msg)
    } else {
      window.localStorage.removeItem('trainingStatus')
      trainingDialogVisible.value = false
      currentTrainingHour.value = 0
      currentTrainingMinute.value = 0
      currentTrainingSecond.value = 0
      ElMessage.success('取消模拟成功, 请在模拟记录中查看模拟结果')
    }
  } catch (e) {
    ElMessage.error('取消模拟失败，请检查网络环境')
  } finally {
    cancelBtnLoading.value = false
  }
}

onMounted(() => {
  getModelList()
  // 判断时间先后
  if (window.localStorage.getItem('trainingStatus') !== null){
    const trainingStatus = JSON.parse(window.localStorage.getItem('trainingStatus'))
    currentTrainingMillisecond.value = trainingStatus.currentTrainingMillisecond
    currentTrainingSecond.value = trainingStatus.currentTrainingSecond
    currentTrainingMinute.value = trainingStatus.currentTrainingMinute
    currentTrainingHour.value = trainingStatus.currentTrainingHour
    currentTrainingId.value = trainingStatus.currentTrainingId
    trainingDialogVisible.value = true
    isPause.value = true
  }
})

onBeforeUnmount(() => {
  if(trainingDialogVisible.value){
    stopCountUp()
    // 向window.localStorage中写入暂停/继续的状态
    const trainingDetail = {
      policeId: (JSON.parse(Cookies.get('person'))).id,
      currentTrainingId: currentTrainingId.value,
      currentTrainingMillisecond: currentTrainingMillisecond.value,
      currentTrainingSecond: currentTrainingSecond.value,
      currentTrainingMinute: currentTrainingMinute.value,
      currentTrainingHour: currentTrainingHour.value
    }
    window.localStorage.setItem('trainingStatus', JSON.stringify(trainingDetail))
  }
})
</script>

<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/police/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>模拟场景选择</el-breadcrumb-item>
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
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >
      <el-empty v-if="modelData.length === 0" description="暂无数据"></el-empty>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="场景名称"></el-table-column>
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
          <el-tooltip effect="light" content="查看场景具体信息" placement="top" :enterable="false">
            <el-button type="success" circle size="small" @click="showCheckDialog(scope.row.id)">
              <el-icon><InfoFilled /></el-icon>
            </el-button>
          </el-tooltip>
          <el-button type="primary" size="small" @click="startTraining(scope.row.id)">
            <el-icon><Opportunity /></el-icon>
            开始模拟
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
  <!--查看场景具体信息弹窗-->
  <el-dialog
    title="场景信息"
    v-model="checkModelDialogVisible"
    center
    :before-close="handleCheckModelDialogClose"
  >
    <el-form :model="checkModelData" ref="checkModelFormRef" :disabled="true">
      <el-form-item label="场景名称">
        <el-input v-model="checkModelData.name" placeholder="请输入场景名称">
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
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="优先级别">
        <el-tooltip
          effect="light"
          content="数字越小(-65525~65535),优先级越高"
          placement="bottom"
        >
          <el-input-number v-model="checkModelData.priority" :min="-65535" :max="65535" :step="1"></el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="场景描述">
        <el-input type="textarea" maxlength="255" rows="5" v-model="checkModelData.description" show-word-limit>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="checkModelDialogVisible=false">关闭</el-button>
      </span>
    </template>
  </el-dialog>

<!-- 警员训练弹窗 -->
  <el-dialog
    center
    v-model="trainingDialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <div class="trainingBody">
      <div>
        <span style="font-size: 2em">您正在进行场景 {{currentTrainingModelName}} 的模拟</span>
      </div>
      <p></p>
      <div>
        <span style="font-size: 1em">当前模拟时长</span>
        <p></p>
        <span style="font-size: 3em">
          {{currentTrainingHour}}:{{currentTrainingMinute}}:{{currentTrainingSecond}}:{{currentTrainingMillisecond.toString().substring(0, 2)}}
        </span>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="danger"
          :loading="cancelBtnLoading"
          :disabled="cancelBtnLoading"
          @click="cancelTraining"
        >
          <el-icon><CircleClose /></el-icon>
          取消模拟
        </el-button>
        <el-button
          v-if="!isPause"
          type="warning"
          :loading="pauseBtnLoading"
          :disabled="pauseBtnLoading"
          @click="pauseOrContinueTraining"
        >
          <el-icon><VideoPause /></el-icon>
          暂停模拟
        </el-button>
        <el-button
          v-else
          type="success"
          :loading="pauseBtnLoading"
          :disabled="pauseBtnLoading"
          @click="pauseOrContinueTraining"
        >
          <el-icon><VideoPlay /></el-icon>
          继续模拟
        </el-button>
        <el-button
          type="primary"
          :loading="stopBtnLoading"
          @click="stopTraining"
          :disabled="stopBtnLoading"
        >
          <el-icon><CircleCheck /></el-icon>
          结束模拟
        </el-button>
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
.trainingBody{
  text-align: center;
}
</style>
