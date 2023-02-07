<script setup>
import {onMounted, ref, watch} from 'vue'
import axios from '../../../api/request'
import {ElLoading, ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import * as echarts from 'echarts'
import {useStorage} from '@vueuse/core'

const store = useStore()

const accessData = ref({
  workingModeNumber: 0,
  finishTrainTimeDaily: 0,
  loginTimeDaily: 0,
  finishTrainTimeWeekly: 0
})

const modelUseData = ref([])

const getAccessData = async () => {
  try{
    const {data} = await axios.get('/backstage-management-service/prison/mainPage')
    if(data.code !== 2000){
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
    const {data} = await axios.get('/backstage-management-service/prison/mainPage/dynamic')
    if(data.code !== 2000){
      ElMessage.error("请求数据失败")
    } else {
      modelUseData.value = data.data
    }
  } catch (e) {
    ElMessage.error("请求模型使用数据失败")
  }
}

const finishTrainingCount = ref([])

const getFinishTrainingCount = async () => {
  try{
    const {data} = await axios.get('/backstage-management-service/prison/mainPage/stats')
    if(data.code !== 2000){
      ElMessage.error("请求数据失败")
    } else {
      finishTrainingCount.value = data.data
    }
  } catch (e) {
    ElMessage.error("请求模型使用数据失败")
  }
}
let myChart = ref(null)
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

  for (const item of finishTrainingCount.value) {
    option.series[0].data.push({
      value: item.numberOfPolice,
      name: item.modelName
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
  if (myChart !== null && myChart !== '' && myChart !== undefined) {
    myChart.dispose(); //销毁
  }
  drawPieChart()
})

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
    await getFinishTrainingCount()
    drawPieChart()
  } catch (e) {
    ElMessage.error("请求首页数据失败")
  } finally {
    loading.close()
  }
})
</script>

<template>
  <el-row :gutter="15">
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><DocumentCopy /></el-icon>
            <span>场景模型启用数量</span>
          </div>
        </template>
        {{accessData.workingModeNumber}}
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><OfficeBuilding /></el-icon>
            <span>今日监所在线人数</span>
          </div>
        </template>
        {{accessData.loginTimeDaily}}
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><User /></el-icon>
            <span>今日完成模拟人次</span>
          </div>
        </template>
        {{accessData.finishTrainTimeDaily}}
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Calendar /></el-icon>
            <span>本周完成模拟人次</span>
          </div>
        </template>
        {{accessData.finishTrainTimeWeekly}}
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="15" style="margin-top: 2%">
    <el-col :span="12">
      <el-card class="graphCard">
        <template #header>
          <div class="card-header">
            <el-icon><Help /></el-icon>
            <span>本周各项训练完成分布</span>
          </div>
        </template>
        <el-empty v-if="finishTrainingCount.length === 0" description="暂无数据"></el-empty>
        <div v-else class="graphBox">
          <div id="pie" style="width: 400px; height: 350px;"></div>
        </div>
      </el-card>
    </el-col>
    <!--场景模拟动态-->
    <el-col :span="12">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon><Menu /></el-icon>
            <span>场景模拟动态</span>
          </div>
        </template>
        <el-empty v-if="modelUseData.length === 0" description="暂无数据"></el-empty>
        <ul v-else>
          <li v-for="item in modelUseData" :key="item.id">
            <!--对齐内容-->
            <el-row :gutter="20">
              <el-col :span="8">
                <span>{{item.policeName}}</span>
              </el-col>
              <el-col :span="8">
                <span>完成了</span>
              </el-col>
              <el-col :span="8">
                <span>{{item.modelName}}</span>
              </el-col>
            </el-row>
            <div style="text-align: start;font-size: 10px;margin-left: 6%;color: gray">
              <span>完成时间:{{item.endTime}}</span>
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
