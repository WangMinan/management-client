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

const total = ref(0)
const policeList = ref([])
const policeLoading = ref(false)
const policeTableRef = ref()
const getPoliceList = async () => {
  policeLoading.value = true
  try{
    let resp = {}
    if (queryInfo.value.query === '') {
      resp = await axios.get(`/backstage-management-service/prison/police/query/${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    } else {
      resp = await axios.get(`/backstage-management-service/prison/police/query/${queryInfo.value.query}/${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    }
    const data = resp.data
    if (data.code === 200) {
      policeList.value = data.data.list
      total.value = data.data.total
      console.log(policeList.value)
    } else {
      ElMessage.error(data.message)
    }
  } catch (e) {
    ElMessage.error('获取警员列表失败')
  } finally {
    policeLoading.value = false
  }
}

const handleSizeChange = (newSize) => {
  queryInfo.pageSize = newSize
  getPoliceList()
}
const handleCurrentChange = (newPage) => {
  queryInfo.pageNum = newPage
  getPoliceList()
}

onMounted(() => {
  getPoliceList()
})
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>监所警员管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%">
    <!--搜索框-->
    <el-row class="searchRow">
      <el-col :span = "10">
        <!--需要绑定@clear以在清空文本框时做状态更新-->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getPoliceList">
          <template #append>
            <el-button @click="getPoliceList">
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
      <!--按钮区-->
      <el-col :span="6" class="btnCol">
        <el-button type="primary" @click="addPoliceDialogVisible = true">
          <el-icon><Edit/></el-icon>
          添加警员
        </el-button>
        <el-button type="danger" @click="deletePolices">
          <el-icon><Delete/></el-icon>
          删除警员
        </el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table
        style="width: 100%;"
        v-loading="policeLoading"
        :ref="policeTableRef"
        :data="policeList"
        border stripe
        @selection-change="handleSelectionChange"
    >
      <el-empty v-if="policeList.length === 0" description="暂无数据"></el-empty>
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="警员名称"></el-table-column>
      <el-table-column prop="accountNumber" label="警员账号"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-tooltip effect="light" content="警员具体信息查看" placement="top" :enterable="false">
            <el-button type="success" circle size="small" @click="showCheckDialog(scope.row.id)">
              <el-icon><InfoFilled /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="警员信息修改" placement="top" :enterable="false">
            <el-button type="primary" circle size="small" @click="showUpdateDialog(scope.row.id)">
              <el-icon><Edit /></el-icon>
            </el-button>
          </el-tooltip>
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
