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
const prisonManagerData = ref([])
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
    // let resp = {}
    // if(queryInfo.value.query === ''){
    //   resp =
    //     await axios.get(`/backstage-management-service/admin/prison/
    //     ${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    // } else {
    //   resp =
    //       await axios.get(`/backstage-management-service/admin/prison/
    //     ${queryInfo.value.query}/${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    // }
    // const data = resp.data
    // if(data.code !== '200'){
    //   ElMessage.error(data.msg)
    // }
    // prisonData.value = data.data
    // total.value = data.total
    prisonData.value = adminApi.getPrisonTotalData().data.list
    total.value = adminApi.getPrisonTotalData().data.total
  } catch (e) {
    ElMessage.error('获取监狱列表失败，部分功能收到影响，请检查网络环境')
  }
}

const getPrisonManagerList = async () => {
  try{
    prisonManagerLoading.value=true
    // let resp = {}
    // if(queryInfo.value.query === ''){
    //   resp =
    //     await axios.get(`/backstage-management-service/admin/padmin/
    //     ${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    // } else {
    //   resp =
    //       await axios.get(`/backstage-management-service/admin/padmin/
    //     ${queryInfo.value.query}/${queryInfo.value.pageNum}/${queryInfo.value.pageSize}`)
    // }
    // const data = resp.data
    // if(data.code !== '200'){
    //   ElMessage.error(data.msg)
    // }
    // prisonManagerData.value = data.data
    // total.value = data.total
    prisonManagerData.value = adminApi.getPrisonManagerTotalData().data.list
    total.value = adminApi.getPrisonManagerTotalData().data.total
  } catch (e) {
    ElMessage.error('获取监狱管理员列表失败，请检查网络环境')
  } finally {
    prisonManagerLoading.value=false
  }
}

onMounted(() => {
  getPrisonList()
  getPrisonManagerList()
})

const handleSizeChange = (newSize) => {
  queryInfo.pageSize = newSize
  getPrisonManagerList()
}
const handleCurrentChange = (newPage) => {
  queryInfo.pageNum = newPage
  getPrisonManagerList()
}

const handleSelectionChange = (val) => {
  prisonManagerSelection.value.idList = val.map(item => item.accountNumber)
}

// 接下来是新增监狱管理员的部分
let addPrisonManagerDialogVisible = ref(false)

const addPrisonManagerForm = ref({
  prisonName: '',
  nickname:'',
  password:''
})

const addPrisonManagerFormRef = ref()

const addPrisonManagerRules = ref({
  prisonName: [
    {required: true, message: '请选择监狱管理员名称', trigger: 'blur'},
  ],
  nickname: [
    {required: true, message: '请输入监狱管理员昵称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入监狱管理员密码', trigger: 'blur'},
    {min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur'}
  ]
})

const addPrisonManager = async (form) => {
  if(!form){
    return
  }
  await form.validate(async (valid, fields) => {
    if (valid) {
      const {data} =
          await axios.post('/backstage-management-service/admin/padmin',addPrisonManagerForm.value)
      if(data.code === 200) {
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
const deletePrisonManagers = () => {
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
        await axios.delete('/backstage-management-service/admin/padmin',
            {data: prisonManagerSelection.value})
    if(data.code === 200) {
      ElMessage.success('删除成功')
      await getPrisonManagerList()
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
    <el-breadcrumb-item :to="{ path: '/adminHome' }">首页</el-breadcrumb-item>
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
      <el-table-column type="selection"></el-table-column>
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
      <el-form-item prop="nickname" label="管理员昵称">
        <el-input v-model="addPrisonManagerForm.nickname" placeholder="请输入管理员昵称">
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="管理员密码">
        <el-input
          v-model="addPrisonManagerForm.password"
          placeholder="请输入管理员密码"
          type="password"
          show-password
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock />
            </el-icon>
          </template>
        </el-input>
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