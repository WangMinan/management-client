<script setup>
import {onMounted, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import axios from '../../../api/request'
import {ElLoading, ElMessage} from 'element-plus'
import * as echarts from 'echarts'

const store = useStore()
const router = useRouter()
const accessData = ref({
  // 今日访问量
  accessCount: 0,
  // 今日训练量
  trainingCount: 0,
  // 本周训练量
  weeklyTrainingCount: 0,
  // 流量
  flow: 0,
  // 上周访问
  accessLastWeek: []
})

const modelUseData = ref([])
const getAccessData = async () => {
  try{
    const {data} = await axios.get('/backstage-management-service/admin/stats')
    if(data.code !== 200){
      ElMessage.error("请求数据失败")
    } else {
      accessData.value = data.data
    }
  } catch (e) {
    ElMessage.error("请求访问数据失败")
  }
}

const getModelUseData = async () => {
  try{
    const {data} = await axios.get('/backstage-management-service/admin/mainPage/dynamic')
    if(data.code !== 200){
      ElMessage.error("请求数据失败")
    } else {
      modelUseData.value = data.data
    }
  } catch (e) {
    ElMessage.error("请求模型使用数据失败")
  }
}

// 绘制首页折线图
const drawLineChart = () => {
  let option = {
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  };
  option.series = {
    data: accessData.value.accessLastWeek,
    type: 'line'
  }
  const myChart = echarts.init(document.getElementById('line'));
  myChart.setOption(option);
}

onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载首页数据',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try{
    store.commit('saveNavState', '')
    await getAccessData()
    await getModelUseData()

    drawLineChart()
  } catch (e) {
    ElMessage.error("请求首页数据失败")
  } finally {
    loading.close()
  }

});
</script>

<template>
  <el-row :gutter="15">
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><House /></el-icon>
            <span>今日访问</span>
          </div>
        </template>
        {{accessData.accessCount}}
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Clock /></el-icon>
            <span>今日训练</span>
          </div>
        </template>
        {{accessData.trainingCount}}
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Soccer /></el-icon>
            <span>本周训练</span>
          </div>
        </template>
        {{accessData.weeklyTrainingCount}}
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Calendar /></el-icon>
            <span>历史流量</span>
          </div>
        </template>
        {{accessData.flow}}
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="15" style="margin-top: 2%">
    <!--上周访问流量统计折线图-->
    <el-col :span="12">
      <el-card class="graphCard">
        <template #header>
          <div class="card-header">
            <el-icon><ChromeFilled /></el-icon>
            <span>上周访问流量</span>
          </div>
          <div class="graphBox">
            <div id="line" style="width: 400px; height: 300px;"></div>
          </div>
        </template>
      </el-card>
    </el-col>
    <!--模型启用动态-->
    <el-col :span="12">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Menu /></el-icon>
            <span>模型启用动态</span>
          </div>
        </template>
        <ul>
          <li v-for="item in modelUseData" :key="item.id">
            <!--对齐内容-->
            <el-row :gutter="20">
              <el-col :span="8">
                <span>{{item.prisonName}}</span>
              </el-col>
              <el-col :span="8">
                <span v-if="item.operation">启用了</span>
                <span v-else>禁用了</span>
              </el-col>
              <el-col :span="8">
                <span>{{item.modelName}}</span>
              </el-col>
            </el-row>
            <div style="text-align: start;font-size: 10px;margin-left: 6%;color: gray">
              <span>启用时间:{{item.time}}</span>
            </div>
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
.cell-item{
  display: flex;
  align-items: center;
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
