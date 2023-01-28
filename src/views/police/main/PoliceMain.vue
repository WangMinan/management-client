<script setup>
import {onMounted, ref, watch} from 'vue'
import axios from '../../../api/request'
import { ElMessage, ElLoading } from 'element-plus'
import * as echarts from "echarts";
import {useStorage} from '@vueuse/core'
import {useRouter} from 'vue-router'

const router = useRouter()
const trainingSummaryData = ref({})

const getTrainingSummaryData = async () => {
  try{
    const {data} = await axios.get('/backstage-management-service/police/home/training')
    if(data.code !== 2000){
      ElMessage.error("请求数据失败")
    } else {
      trainingSummaryData.value = data.data
    }
  } catch (e) {
    ElMessage.error("请求训练数据失败")
  }
}

const trainingDynamicData = ref([])

const getTrainingDynamicData = async () => {
  try{
    const {data} = await axios.get('/backstage-management-service/police/home/dynamic')
    if(data.code !== 2000){
      ElMessage.error("请求数据失败")
    } else {
      trainingDynamicData.value = data.data
    }
  } catch (e) {
    ElMessage.error("请求训练数据失败")
  }
}

const weeklyTrainingData = ref([])

const getWeeklyTrainingData = async () => {
  try{
    const {data} = await axios.get('/backstage-management-service/police/home/weekTraining')
    if(data.code !== 2000){
      ElMessage.error("请求数据失败")
    } else {
      weeklyTrainingData.value = data.data
    }
  } catch (e) {
    ElMessage.error("请求训练数据失败")
  }
}

let myChart = ref()
const checkIsDark = useStorage('vueuse-color-scheme','auto')
// 绘制首页折线图
const drawLineChart = () => {
  let option = {
    backgroundColor: '',
    xAxis: {
      type: 'category',
      data: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        data: weeklyTrainingData.value,
        type: 'line'
      }
    ]
  }
  myChart = echarts.init(document.getElementById('line')
    , checkIsDark.value === 'dark' ? 'dark' : 'light'
  );
  myChart.setOption(option);
}

// 使用自定义监听器来重新绘制图表
watch(checkIsDark, () => {
  if (myChart) {
    myChart.dispose(); //销毁
  }
  drawLineChart()
})

onMounted(async () => {
  // 调用全局遮罩
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载首页数据...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    await getTrainingSummaryData()
    await getTrainingDynamicData()
    await getWeeklyTrainingData()
    drawLineChart()
    // 确认是否正在训练
    const {data} = await axios.get('/backstage-management-service/police/home/isTraining')
    if(data.code === 2000 && data.data.isTraining === true){
      await router.push('/police/training')
    }
  } catch (e) {
    ElMessage.error("请求数据失败")
  } finally {
    loading.close()
  }
})
</script>

<template>
  <el-row :gutter="15">
    <el-col :span="8">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><House /></el-icon>
            <span>今日预计模拟</span>
          </div>
        </template>
        {{trainingSummaryData.dailyTasks}}
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Soccer /></el-icon>
            <span>今日完成模拟</span>
          </div>
        </template>
        {{trainingSummaryData.dailyCompletedTasks}}
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Calendar /></el-icon>
            <span>本周总计模拟</span>
          </div>
        </template>
        {{trainingSummaryData.weeklyModels}}
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="15" style="margin-top: 2%">
    <el-col :span="12">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><VideoPlay /></el-icon>
            <span>本周模拟情况</span>
          </div>
        </template>
        <el-empty v-if="weeklyTrainingData.length === 0" description="暂无数据" />
        <div class="graphBox">
          <div id="line" style="width: 500px; height: 300px;"></div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <div class="card-header">
          <el-icon><Menu /></el-icon>
          <span>场景模拟动态</span>
        </div>
        <ul>
          <li v-for="item in trainingDynamicData" :key="item.modelName">
            <el-row>
              <el-col :span="2">
                <span>您在</span>
              </el-col>
              <el-col :span="16">
                <span>{{item.startTime}}到{{item.endTime}}期间</span>
              </el-col>
              <el-col :span="6">
                <span>完成了{{item.modelName}}</span>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.el-card{
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
.graphCard{
  .graphBox{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
