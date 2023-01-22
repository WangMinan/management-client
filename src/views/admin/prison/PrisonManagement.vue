<script setup>
import { onMounted, ref } from 'vue'
import axios from '../../../api/request'
import { ElMessage, ElMessageBox } from 'element-plus'

const prisonTableRef = ref()
// 保存所有选中的监狱的id
const prisonSelection = ref({
  idList: []
})
// 保存表格中的监狱数据
const prisonData = ref([])
// 表格的加载圈
const prisonLoading = ref(false)
// 请求参数的格式
const queryInfo = ref({
  query: '',
  // 当前页码
  pageNum: 1,
  pageSize: 5
})

const total = ref(0)

const getPrisonList = async () => {
  try{
    prisonLoading.value=true
    const {data} = await axios.get('/backstage-management-service/admin/prison', {
      params: {
        query: queryInfo.value.query,
        pageNum: queryInfo.value.pageNum,
        pageSize: queryInfo.value.pageSize
      }
    })
    if(data.code !== 200){
      ElMessage.error(data.msg)
    } else {
      prisonData.value = data.data.list
      total.value = data.data.total
    }
    // prisonData.value = adminApi.getPrisonTotalData().data.list
    // total.value = adminApi.getPrisonTotalData().data.total
  } catch (e) {
    ElMessage.error('获取监狱列表失败，请检查网络环境')
  } finally {
    prisonLoading.value=false
  }
}

onMounted(() => {
  getPrisonList()
})

const handleSizeChange = (newSize) => {
  queryInfo.pageSize = newSize
  getPrisonList()
}
const handleCurrentChange = (newPage) => {
  queryInfo.pageNum = newPage
  getPrisonList()
}

const handleSelectionChange = (val) => {
  prisonSelection.value.idList = val.map(item => item.id)
}

// 接下来是新增监狱的部分
let addPrisonDialogVisible = ref(false)

const addPrisonForm = ref({
  prisonName:''
})

const addPrisonFormRef = ref()

const addPrisonRules = ref({
  prisonName: [
    {required: true, message: '请输入监狱名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ]
})

const addPrison = async (form) => {
  if(!form){
    return
  }
  await form.validate(async (valid, fields) => {
    if (valid) {
      const {data} =
          await axios.post('/backstage-management-service/admin/prison',addPrisonForm.value)
      if(data.code === 200) {
        ElMessage.success('新增监狱成功')
        addPrisonDialogVisible.value = false
        await getPrisonList()
      } else {
        ElMessage.error(data.msg)
      }
    } else {
      ElMessage.error('预校验未通过,请检查输入')
    }
  })
}

const resetAddPrisonForm = (form) => {
  if (!form) {
    return
  }
  form.resetFields()
}

// 接下来是删除监所的部分
const deletePrisons = async () => {
  if(prisonSelection.value.idList.length === 0){
    ElMessage.error('请至少选择一个监狱')
    return
  }
  ElMessageBox.confirm('此操作将永久删除选中的监狱, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {data} =
        await axios.delete('/backstage-management-service/admin/prison', {data: prisonSelection.value})
    if(data.code === 200) {
      ElMessage.success('删除成功')
      await getPrisonList()
    } else {
      ElMessage.error(data.msg)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>监所信息管理</el-breadcrumb-item>
    <el-breadcrumb-item>监所管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%">
    <!--搜索框-->
    <el-row class="searchRow">
      <el-col :span = "10">
        <!--需要绑定@clear以在清空文本框时做状态更新-->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getPrisonList">
          <template #append>
            <el-button @click="getPrisonList">
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
      <!--按钮区-->
      <el-col :span="6" class="btnCol">
        <el-button type="primary" @click="addPrisonDialogVisible = true">
          <el-icon><Edit/></el-icon>
          添加监所
        </el-button>
        <el-button type="danger" @click="deletePrisons">
          <el-icon><Delete/></el-icon>
          删除监所
        </el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table
      style="width: 100%;"
      v-loading="prisonLoading"
      :ref="prisonTableRef"
      :data="prisonData"
      border stripe
      @selection-change="handleSelectionChange"
    >
      <el-empty v-if="prisonData.length === 0" description="暂无数据"></el-empty>
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="监所名称"></el-table-column>
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
  <!--添加监所弹窗-->
  <el-dialog
    title="添加监所"
    v-model="addPrisonDialogVisible"
    center
    @closed="resetAddPrisonForm(addPrisonFormRef)"
  >
    <el-form :model="addPrisonForm" ref="addPrisonFormRef" :rules="addPrisonRules">
      <el-form-item prop="prisonName" label="监所名称">
        <el-input v-model="addPrisonForm.prisonName" placeholder="请输入监所名称">
          <template #prefix>
            <el-icon><OfficeBuilding /></el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="addPrison(addPrisonFormRef)">
          确认
        </el-button>
        <el-button @click="addPrisonDialogVisible=false">取消</el-button>
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
