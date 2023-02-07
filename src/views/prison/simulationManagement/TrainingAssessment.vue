<script setup>

// 请求参数的格式
import {onMounted, ref, watch} from 'vue'
import axios from '../../../api/request'
import {ElMessage, ElMessageBox} from 'element-plus'
import * as echarts from "echarts";
import {useStorage} from "@vueuse/core";

const assessmentList = ref([])
const queryInfo = ref({
  query: '',
  // 当前页码
  pageNum: 1,
  pageSize: 5
})
const total = ref(0)
const assessmentLoading = ref(false)
const assessmentTableRef = ref()
const getAssessmentList = async () => {
  // 请求数据
  try{
    const {data} = await axios.get('/backstage-management-service/prison/totalAssess',{
      params: {
        query: queryInfo.value.query,
        pageNum: queryInfo.value.pageNum,
        pageSize: queryInfo.value.pageSize
      }
    })
    if(data.code !== 2000){
      ElMessage.error(data.msg)
    } else {
      total.value = data.data.total
      assessmentList.value = data.data.list
      assessmentLoading.value = false
    }
  } catch (e) {
    ElMessage.error('请求评估数据失败')
  } finally {
    assessmentLoading.value = false
  }
}

onMounted(() => {
  getAssessmentList()
})

const handleSizeChange = (newSize) => {
  queryInfo.pageSize = newSize
  getAssessmentList()
}
const handleCurrentChange = (newPage) => {
  queryInfo.pageNum = newPage
  getAssessmentList()
}
const handleSelectionChange = (val) => {
  assessmentSelection.value.idList = val.map(item => item.id)
}
// 删除模拟记录
const assessmentSelection = ref({
  idList: []
})
const deleteAssessment = async () => {
  if (assessmentSelection.value.idList.length === 0) {
    ElMessage.error('请选择要删除的模拟记录')
    return
  }
  ElMessageBox.confirm('此操作将永久删除选中的模拟记录, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {data} =
        await axios.delete('/backstage-management-service/prison/police',
            {
              data: {
                idList: assessmentSelection.value.idList
              }
            })
    if(data.code === 2000) {
      ElMessage.success('删除成功')
      await getAssessmentList()
    } else {
      ElMessage.error(data.msg)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 查看模拟记录
const checkAssessmentDialogVisible = ref(false)
const checkAssessmentData = ref({})
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
      value: checkAssessmentData.value.mentalPercentList[i],
      name: emotions[i]
    })
  }
  myChart = echarts.init(document.getElementById('pie'),
  window.localStorage.getItem('vueuse-color-scheme') === 'dark' ? 'dark' : 'light'
  );
  myChart.setOption(option);
}

const showCheckDialog = (id) => {
  checkAssessmentData.value = assessmentList.value.find(item => item.id === id)
  checkAssessmentDialogVisible.value = true
}

// 使用自定义监听器来重新绘制图表
const checkIsDark = useStorage('vueuse-color-scheme','auto')
watch(checkIsDark, () => {
  if (myChart) {
    myChart.dispose(); //销毁
  }
  drawPieChart()
})
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/prison/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>模拟项目管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%">
    <!--搜索框-->
    <el-row class="searchRow">
      <el-col :span = "10">
        <!--需要绑定@clear以在清空文本框时做状态更新-->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getAssessmentList">
          <template #append>
            <el-button @click="getAssessmentList">
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
      <!--按钮区-->
      <el-col :span="6" class="btnCol">
        <el-button type="danger" @click="deleteAssessment">
          <el-icon><Delete/></el-icon>
          删除模拟记录
        </el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table
        style="width: 100%;"
        v-loading="assessmentLoading"
        :ref="assessmentTableRef"
        :data="assessmentList"
        border stripe
        @selection-change="handleSelectionChange"
    >
      <el-empty v-if="assessmentList.length === 0" description="暂无数据"></el-empty>
      <el-table-column type="selection"/>
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="policeName" label="警员姓名"/>
      <el-table-column prop="result" label="模拟结果"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="showCheckDialog(scope.row.id)">
            <el-icon><InfoFilled /></el-icon>
            <span>查看模拟具体信息</span>
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
.graphCard{
  .graphBox{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
.el-dialog{
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
}
</style>
