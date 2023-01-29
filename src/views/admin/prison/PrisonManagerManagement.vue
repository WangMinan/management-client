<script setup>
import { onMounted, ref } from 'vue'
import axios from '../../../api/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import adminApi from '../../../api/mockdata/admin/admin.js'

const prisonManagerTableRef = ref()
// 保存所有选中的监狱管理员的id
const prisonManagerSelection = ref(
  {
    idList: []
  }
)
// 新增管理员下拉菜单中的监所数据
const prisonData = ref([])
// 保存表格中的监狱管理员数据
const prisonManagerData = ref([{
  id: '',
  nickname: '',
  accountNumber: '',
  prisonName: ''
}])
// 表格的加载圈
const prisonManagerLoading = ref(false)
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
    const {data} = await axios.get('/backstage-management-service/admin/prison',{
      params: {
        query: queryInfo.value.query,
        pageNum: queryInfo.value.pageNum,
        pageSize: queryInfo.value.pageSize
      }
    })
    if(data.code !== 2000){
      ElMessage.error(data.msg)
    }
    prisonData.value = data.data.list
    // prisonData.value = adminApi.getPrisonTotalData().data.list
    // total.value = adminApi.getPrisonTotalData().data.total
  } catch (e) {
    ElMessage.error('获取监狱列表失败，部分功能收到影响，请检查网络环境')
  }
}

const getPrisonManagerList = async () => {
  console.log('hello')
  try{
    prisonManagerLoading.value=true
    const {data} = await axios.get('/backstage-management-service/admin/padmin',{
      params: {
        query: queryInfo.value.query,
        pageNum: queryInfo.value.pageNum,
        pageSize: queryInfo.value.pageSize
      }
    })
    if(data.code !== 2000){
      ElMessage.error(data.msg)
    } else {
      // 赋值 不允许data.data.list数组的元素中id字段被舍入
      prisonManagerData.value = data.data.list
      console.log(data.data.list)
      total.value = data.data.total
      // prisonManagerData.value = adminApi.getPrisonManagerTotalData().data.list
      // total.value = adminApi.getPrisonManagerTotalData().data.total
    }
  } catch (e) {
    ElMessage.error('获取监狱管理员列表失败，请检查网络环境')
  } finally {
    prisonManagerLoading.value=false
  }
}

const handleSizeChange = (newSize) => {
  queryInfo.pageSize = newSize
  getPrisonManagerList()
}
const handleCurrentChange = (newPage) => {
  queryInfo.pageNum = newPage
  getPrisonManagerList()
}

const handleSelectionChange = (val) => {
  prisonManagerSelection.value.idList = val.map(item => item.id)
}

// 接下来是新增监狱管理员的部分
let addPrisonManagerDialogVisible = ref(false)

const addPrisonManagerForm = ref({
  prisonName: ''
})

const addPrisonManagerFormRef = ref()

const addPrisonManagerRules = ref({
  prisonName: [
    {required: true, message: '请选择监狱管理员名称', trigger: 'blur'},
  ]
})

const addPrisonManager = async (form) => {
  if(!form){
    return
  }
  await form.validate(async (valid, fields) => {
    if (valid) {
      const {data} =
          await axios.post('/backstage-management-service/admin/prison/padmin',addPrisonManagerForm.value)
      if(data.code === 2000) {
        ElMessage.success('新增监狱管理员成功')
        addPrisonManagerDialogVisible.value = false
        await getPrisonManagerList()
      } else {
        ElMessage.error(data.msg)
      }
    } else {
      ElMessage.error('预校验未通过,请检查输入')
    }
  })
}

const resetPrisonManagerForm = (form) => {
  if (!form) {
    return
  }
  form.resetFields()
}

// 接下来是删除监所的部分
const deletePrisonManagers = async () => {
  if(prisonManagerSelection.value.idList.length === 0){
    ElMessage.error('请至少选择一个管理员')
    return
  }
  ElMessageBox.confirm('此操作将永久删除选中的管理员, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {data} =
        await axios.delete('/backstage-management-service/admin/prison/padmin',
            {data: prisonManagerSelection.value})
    if(data.code === 2000) {
      ElMessage.success('删除成功')
      await getPrisonManagerList()
    } else {
      ElMessage.error(data.msg)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

onMounted(() => {
  getPrisonList()
  getPrisonManagerList()
})
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>监所信息管理</el-breadcrumb-item>
    <el-breadcrumb-item>监所管理员管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%">
    <!--搜索框-->
    <el-row class="searchRow">
      <el-col :span = "10">
        <!--需要绑定@clear以在清空文本框时做状态更新-->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getPrisonManagerList">
          <template #append>
            <el-button @click="getPrisonManagerList">
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
      <!--按钮区-->
      <el-col :span="6" class="btnCol">
        <el-button type="primary" @click="addPrisonManagerDialogVisible = true">
          <el-icon><Edit/></el-icon>
          添加管理员
        </el-button>
        <el-button type="danger" @click="deletePrisonManagers">
          <el-icon><Delete/></el-icon>
          删除管理员
        </el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table
        style="width: 100%;"
        v-loading="prisonManagerLoading"
        :ref="prisonManagerTableRef"
        :data="prisonManagerData"
        border stripe
        @selection-change="handleSelectionChange"
    >
      <el-empty v-if="prisonManagerData.length === 0" description="暂无数据"></el-empty>
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="accountNumber" label="账号"></el-table-column>
      <el-table-column prop="nickname" label="监所管理员昵称"></el-table-column>
      <el-table-column prop="prisonName" label="所属监狱"></el-table-column>
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
  <!--添加监所管理员弹窗-->
  <el-dialog
      title="添加监所管理员"
      v-model="addPrisonManagerDialogVisible"
      center
      @closed="resetPrisonManagerForm(addPrisonManagerFormRef)"
  >
    <div>账号将自动生成,初始密码同账号</div>
    <el-form :model="addPrisonManagerForm" ref="addPrisonManagerFormRef" :rules="addPrisonManagerRules">
      <el-form-item prop="prisonName" label="管理员监所">
        <el-select v-model="addPrisonManagerForm.prisonName" placeholder="请选择管理员所在监所名称">
          <template #prefix>
            <el-icon><OfficeBuilding /></el-icon>
          </template>
          <el-option
              v-for="item in prisonData"
              :key="item.name"
              :label="item.name"
              :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="addPrisonManager(addPrisonManagerFormRef)">
          确认
        </el-button>
        <el-button @click="addPrisonManagerDialogVisible=false">取消</el-button>
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
</style>
