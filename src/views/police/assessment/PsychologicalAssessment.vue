<script setup>
import {onMounted, ref, watch} from 'vue'
import {ElMessage} from 'element-plus'
import axios from '../../../api/request'
import * as echarts from "echarts";
import {useStorage} from "@vueuse/core";

const assessmentData = ref({
  id: '',
  mentalPercentList : [],
  result: false,
  description: '',
  createTime: '',
  updateTime: ''
})

const assessmentLoading = ref(false)

const getAssessmentData = async() => {
  assessmentLoading.value = true
  try {
    const {data}= await axios.get('/backstage-management-service/police/totalResult')
    if(data.code !== 2000){
      ElMessage.error(data.msg)
    } else {
      assessmentData.value = data.data
    }
  } catch (e) {
    ElMessage.error('获取评估数据失败')
  } finally {
    assessmentLoading.value = false
  }
}

let myChart = ref()
const drawPieChart = () => {
  let option = {
    backgroundColor:'',
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: []
      }
    ]
  }

  const emotions = [
    '愤怒', '厌恶', '恐惧', '高兴', '悲伤', '惊讶'
  ]
  for (let i = 0; i < emotions.length; i++) {
    option.series[0].data.push({
      value: assessmentData.value.mentalPercentList[i],
      name: emotions[i]
    })
  }
  myChart = echarts.init(document.getElementById('pie'),
      window.localStorage.getItem('vueuse-color-scheme') === 'dark' ? 'dark' : 'light'
  );
  myChart.setOption(option);
}

// 使用自定义监听器来重新绘制图表
const checkIsDark = useStorage('vueuse-color-scheme','auto')
watch(checkIsDark, () => {
  if (myChart) {
    myChart.dispose(); //销毁
  }
  drawPieChart()
})

onMounted(async () => {
  await getAssessmentData()
  drawPieChart()
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
            <el-icon><TrendCharts /></el-icon>
            <span>情绪分析</span>
          </div>
        </template>
        <div class="graphCard">
          <el-empty v-if="assessmentData.mentalPercentList.length === 0" description="暂无数据" />
          <div v-else class="graphBox">
            <div id="pie" style="width: 400px; height: 300px"></div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Stopwatch /></el-icon>
            <span>评估结果</span>
          </div>
        </template>
        <el-empty v-if="assessmentData.description === ''" description="暂无数据" />
        <div v-else>
          <span v-if="assessmentData.result">您的心理状态: 总体<strong>正常</strong></span>
          <span v-else>您的心理状态: 总体<strong>异常</strong></span>
          <el-divider>
            <el-icon><star-filled /></el-icon>
          </el-divider>
          <div>评估描述</div>
          <span>{{assessmentData.description}}</span>
          <el-divider>
            <el-icon><star-filled /></el-icon>
          </el-divider>
          <div>评估时间</div>
          <span>{{assessmentData.createTime}} 到 {{assessmentData.updateTime}}</span>
        </div>
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
