<script setup>
import {onMounted, ref, watch} from 'vue'
import axios from '../../../api/request.js'
import {ElMessage} from 'element-plus'
import * as echarts from 'echarts'
import {useStorage} from '@vueuse/core'

// 获取监所数据
const prisonList = ref([
  {
    name:'',
    id:0
  }
])
const prisonName = ref('')
const queryInfo = ref({
  query: '',
  // 当前页码
  pageNum: 1,
  pageSize: 99999
})

const getPrisonList = async () => {
  try {
    const {data} = await axios.get('/backstage-management-service/admin/prison', {
      params: {
        query: queryInfo.value.query,
        pageNum: queryInfo.value.pageNum,
        pageSize: queryInfo.value.pageSize
      }
    })
    if (data.code !== 2000){
      ElMessage.error(data.msg)
    } else {
      prisonList.value = data.data.list
    }
  } catch (e){
    ElMessage.error('获取监所列表失败')
  }
}


// 获取评估数据
const assessmentData = ref([])

const assessmentLoading = ref(false)
const getAssessmentData = async () => {
  assessmentLoading.value = true
  try {
    if(prisonName.value === ''){
      // 重置数据
      assessmentData.value = []
      return
    }
    const prisonId = (prisonList.value.find(item => item.name === prisonName.value)).id
    const {data}= await axios.get(`/psychology-service/assessment/${prisonId}`)
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

// 画图
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
  if(checkAssessmentData.value.mentalPercentList.length !== 0){
    for (let i = 0; i < emotions.length; i++) {
      option.series[0].data.push({
        value: checkAssessmentData.value.mentalPercentList[i],
        name: emotions[i]
      })
    }
  } else {
    for (let i = 0; i < emotions.length; i++) {
      option.series[0].data.push({
        value: 0,
        name: emotions[i]
      })
    }
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
    myChart.dispose(); //销毁原本的图表
  }
  drawPieChart()
})

onMounted( () => {
  getPrisonList()
})

// 表格
const assessmentTableRef = ref()
const checkAssessmentData = ref({
  id: '',
  mentalPercentList : [],
  result: false,
  description: '$',
  createTime: '',
  updateTime: ''
})

const checkAssessmentDialogVisible = ref(false)

const showCheckDialog = (id) => {
    checkAssessmentData.value = assessmentData.value.find(item => item.id === id)
    checkAssessmentDialogVisible.value = true
}
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>监所情况看板</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%; align-items: center">
    <!--需要绑定@clear以在清空文本框时做状态更新-->
    <el-select
      filterable
      style="width: 30%"
      v-model="prisonName"
      placeholder="请选择监所名称"
      clearable
      @change="getAssessmentData">
      <template #prefix>
        <el-icon><OfficeBuilding/></el-icon>
      </template>
      <el-option
        v-for="item in prisonList"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      />
    </el-select>
    <!--表格-->
    <el-table
      style="width: 100%; margin-top: 2%;"
      v-loading="assessmentLoading"
      :ref="assessmentTableRef"
      :data="assessmentData"
      border stripe
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
    >
      <el-empty v-if="assessmentData.length === 0" description="暂无数据"></el-empty>
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="policeName" label="警员姓名"/>
      <el-table-column prop="result" label="评估结果"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="showCheckDialog(scope.row.id)">
            <el-icon><InfoFilled /></el-icon>
            <span>查看模拟具体信息</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!--查看本次评估具体信息-->
  <el-dialog
    title="本次评估详情"
    center
    v-model="checkAssessmentDialogVisible"
    @opened="drawPieChart"
    width="80%"
  >
    <el-row :gutter="15">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><List /></el-icon>
              <span>模拟明细</span>
            </div>
          </template>
          <el-form
            :model="checkAssessmentData"
            ref="checkTrainingFormRef"
            :disabled="true"
          >
            <el-form-item label="评估序号">
              <el-input v-model="checkAssessmentData.id"></el-input>
            </el-form-item>
            <el-form-item label="警员名称">
              <el-input v-model="checkAssessmentData.policeName"></el-input>
            </el-form-item>
            <el-form-item label="评估结果">
              <el-input v-model="checkAssessmentData.result"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-input v-model="checkAssessmentData.createTime"></el-input>
            </el-form-item>
            <el-form-item label="更新时间">
              <el-input v-model="checkAssessmentData.updateTime"></el-input>
            </el-form-item>
            <el-form-item label="评估描述">
              <el-input type="textarea" v-model="checkAssessmentData.description"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
                <el-icon><TrendCharts /></el-icon>
                <span>情绪分析</span>
            </div>
          </template>
          <div class="graphCard">
            <el-empty v-if="checkAssessmentData.mentalPercentList.length === 0" description="暂无数据"></el-empty>
            <div v-else class="graphBox">
                <div id="pie" style="width: 400px; height: 300px"></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="checkAssessmentDialogVisible=false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <!--回到顶部-->
  <el-backtop :right="100" :bottom="100" />
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
