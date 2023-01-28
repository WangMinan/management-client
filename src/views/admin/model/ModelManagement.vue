<script setup>
import { onMounted, ref } from 'vue'
import axios from '../../../api/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import adminApi from '../../../api/mockdata/admin/admin.js'

const modelTableRef = ref()
// 保存所有选中的场景的id
const modelSelection = ref({
  idList: []
})
// 保存表格中的监狱数据
const modelData = ref([])
// 表格的加载圈
const modelLoading = ref(false)
// 请求参数的格式
const queryInfo = ref({
  query: '',
  // 当前页码
  pageNum: 1,
  pageSize: 5
})

const total = ref(0)

const getModelList = async () => {
  try{
    modelLoading.value=true
    const {data} = await axios.get('/psychology-service/model/',{
      params: {
        query: queryInfo.value.query,
        pageNum: queryInfo.value.pageNum,
        pageSize: queryInfo.value.pageSize
      }
    })
    if(data.code !== 2000){
      ElMessage.error(data.msg)
    } else {
      modelData.value = data.data.list
      // 将modalData中的数据按照priority进行从小到大排序
      modelData.value.sort((a,b) => a.priority - b.priority)
      total.value = data.data.total
      // modelData.value = adminApi.getModelTotalData().data.list
      // total.value = adminApi.getModelTotalData().data.total
    }
  } catch (e) {
    ElMessage.error('获取模拟场景列表失败，请检查网络环境')
  } finally {
    modelLoading.value=false
  }
}

onMounted(() => {
  getModelList()
})

const handleSizeChange = (newSize) => {
  queryInfo.pageSize = newSize
  getModelList()
}
const handleCurrentChange = (newPage) => {
  queryInfo.pageNum = newPage
  getModelList()
}

const handleSelectionChange = (val) => {
  modelSelection.value.idList = val.map(item => item.id)
}

// 接下来是新增场景的部分
let addModelDialogVisible = ref(false)

const addModelForm = ref({
  name:'',
  description: '',
  enable: true,
  priority: 0
})

const addModelFormRef = ref()

const addModelRules = ref({
  name: [
    {required: true, message: '请输入场景名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  description: [
    {required: true, message: '请输入场景描述', trigger: 'blur'},
    {min: 5, max: 255, message: '长度在 5 到 255 个字符', trigger: 'blur'}
  ],
  enable: [
    {required: true, message: '请选择是否启用', trigger: 'change'}
  ],
  priority: [
    {required: true, message: '请输入优先级', trigger: 'blur'},
    {type: 'number', message: '优先级必须为数字值', trigger: 'blur'}
  ]
})

const addModel = async (form) => {
  if(!form){
    return
  }
  await form.validate(async (valid, fields) => {
    if (valid) {
      const {data} =
          await axios.post('/psychology-service/model',addModelForm.value)
      if(data.code === 2000) {
        ElMessage.success('新增场景成功')
        addModelDialogVisible.value = false
        await getModelList()
      } else {
        ElMessage.error(data.msg)
      }
    } else {
      ElMessage.error('预校验未通过,请检查输入')
    }
  })
}

const resetAddModelForm = (form) => {
  if (!form) {
    return
  }
  form.resetFields()
}

// 接下来是删除场景(滑动)的部分
const deleteModels = async () => {
  if(modelSelection.value.idList.length === 0){
    ElMessage.error('请至少选择一个场景')
    return
  }
  ElMessageBox.confirm('此操作将永久删除选中的场景, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {data} =
        await axios.delete('/psychology-service/model', {data: modelSelection.value})
    if(data.code === 2000) {
      ElMessage.success('删除成功')
      await getModelList()
    } else {
      ElMessage.error(data.msg)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const stateFormat =  (row, column, cellValue) => {
  if (!cellValue) return ''
  if (cellValue.length > 20) {
    // 最多显示20个字符
    return cellValue.slice(0, 20) + '...'
  }
  return cellValue
}

// 接下来是更新场景的部分
const switchLoading = ref(false)

const updateModelBySwitch = async (row) => {
  switchLoading.value = true
  try {
    const rowData = {
      name: row.name,
      description: row.description,
      enable: row.enable,
      priority: row.priority
    }
    const {data} =
        await axios.put(`/psychology-service/model/${row.id}`, rowData)
    if (data.code === 2000) {
      ElMessage.success('更新场景状态成功')
      await getModelList()
    } else {
      ElMessage.error(data.msg)
      await getModelList()
    }
  } catch (e) {
    ElMessage.error('更新场景状态失败，请检查网络环境')
    await getModelList()
  } finally {
    switchLoading.value = false
  }
}

// 接下来是查看场景具体信息的部分
let checkModelDialogVisible = ref(false)

const checkModelData = ref({
  name: '',
  description: '',
  enable: true,
  priority: 0
})

const checkModelFormRef = ref()

const showCheckDialog = (id) => {
  checkModelDialogVisible.value = true
  const tmpModel = modelData.value.find(item => item.id === id)
  checkModelData.value = {
    name: tmpModel.name,
    description: tmpModel.description,
    enable: tmpModel.enable,
    priority: tmpModel.priority
  }
}

const handleCheckModelDialogClose = () => {
  checkModelDialogVisible.value = false
  checkModelFormRef.value.resetFields()
}

// 接下来是更新场景的部分
let updateModelDialogVisible = ref(false)

const updateModelData = ref({
  id: '',
  name: '',
  description: '',
  enable: true,
  priority: 0
})

const updateModelFormRef = ref()

const showUpdateDialog = (id) => {
  updateModelDialogVisible.value = true
  const tmpModel = modelData.value.find(item => item.id === id)
  updateModelData.value = {
    id: id,
    name: tmpModel.name,
    description: tmpModel.description,
    enable: tmpModel.enable,
    priority: tmpModel.priority
  }
}

const updateModel = async (form) => {
  if(!form){
    return
  }
  const tmpForm = {
    name: updateModelData.value.name,
    description: updateModelData.value.description,
    enable: updateModelData.value.enable,
    priority: updateModelData.value.priority
  }
  await form.validate(async (valid, fields) => {
    if (valid) {
      const {data} =
          await axios.put(`/psychology-service/model/${updateModelData.value.id}`, tmpForm)
      if(data.code === 2000) {
        ElMessage.success('更新场景成功')
        updateModelDialogVisible.value = false
        await getModelList()
      } else {
        ElMessage.error(data.msg)
      }
    } else {
      ElMessage.error('预校验未通过,请检查输入')
    }
  })
}

const handleUpdateModelDialogClose = (form) => {
  updateModelDialogVisible.value = false
  updateModelFormRef.value.resetFields()
}
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/admin/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>模拟项目管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="margin-top: 2%">
    <!--搜索框-->
    <el-row class="searchRow">
      <el-col :span = "10">
        <!--需要绑定@clear以在清空文本框时做状态更新-->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getModelList">
          <template #append>
            <el-button @click="getModelList">
              <el-icon class="el-input__icon">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </el-col>
      <!--按钮区-->
      <el-col :span="6" class="btnCol">
        <el-button type="primary" @click="addModelDialogVisible = true">
          <el-icon><Edit/></el-icon>
          添加场景
        </el-button>
        <el-button type="danger" @click="deleteModels">
          <el-icon><Delete/></el-icon>
          删除场景
        </el-button>
      </el-col>
    </el-row>
    <!--表格-->
    <el-table
      style="width: 100%;"
      v-loading="modelLoading"
      :ref="modelTableRef"
      :data="modelData"
      border stripe
      @selection-change="handleSelectionChange"
    >
      <el-empty v-if="modelData.length === 0" description="暂无数据"></el-empty>
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="场景名称"></el-table-column>
      <el-table-column label="是否启用">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enable"
            inline-prompt
            active-text="启用"
            inactive-text="禁用"
            :loading="switchLoading"
            @change="updateModelBySwitch(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级"></el-table-column>
      <el-table-column prop="description" label="描述" :formatter="stateFormat"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-tooltip effect="light" content="场景具体信息查看" placement="top" :enterable="false">
            <el-button type="success" circle size="small" @click="showCheckDialog(scope.row.id)">
              <el-icon><InfoFilled /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="场景信息修改" placement="top" :enterable="false">
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
  <!--添加场景弹窗-->
  <el-dialog
    title="添加场景"
    v-model="addModelDialogVisible"
    center
    @closed="resetAddModelForm(addModelFormRef)"
  >
    <el-form :model="addModelForm" ref="addModelFormRef" :rules="addModelRules">
      <el-form-item prop="name" label="场景名称">
        <el-input v-model="addModelForm.name" placeholder="请输入场景名称">
          <template #prefix>
            <el-icon><Menu /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="enable" label="是否启用">
        <el-switch
            v-model="addModelForm.enable"
            inline-prompt
            active-text="启用"
            inactive-text="禁用"
        >
        </el-switch>
      </el-form-item>
      <el-form-item prop="priority" label="优先级别">
        <el-tooltip
          effect="light"
          content="数字越小(-65525~65535),优先级越高"
          placement="bottom"
        >
          <el-input-number v-model="addModelForm.priority" :min="-65535" :max="65535" :step="1"></el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item prop="description" label="场景描述">
        <el-input type="textarea" maxlength="255" rows="5" v-model="addModelForm.description" show-word-limit>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="addModel(addModelFormRef)">
          确认
        </el-button>
        <el-button @click="addModelDialogVisible=false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <!--查看场景具体信息弹窗-->
  <el-dialog
    title="场景信息"
    v-model="checkModelDialogVisible"
    center
    :before-close="handleCheckModelDialogClose"
  >
    <el-form :model="checkModelData" ref="checkModelFormRef">
      <el-form-item label="场景名称">
        <el-input v-model="checkModelData.name" placeholder="请输入场景名称" disabled>
          <template #prefix>
            <el-icon><Menu /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
            v-model="checkModelData.enable"
            inline-prompt
            active-text="启用"
            inactive-text="禁用"
            disabled
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="优先级别">
        <el-tooltip
          effect="light"
          content="数字越小(-65525~65535),优先级越高"
          placement="bottom"
        >
          <el-input-number v-model="checkModelData.priority" :min="-65535" :max="65535" :step="1" disabled></el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="场景描述">
        <el-input type="textarea" maxlength="255" rows="5" v-model="checkModelData.description" show-word-limit disabled>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="checkModelDialogVisible=false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <!--修改场景具体信息弹窗-->
  <el-dialog
    title="场景信息修改"
    v-model="updateModelDialogVisible"
    center
    :before-close="handleUpdateModelDialogClose"
  >
    <el-form :model="updateModelData" ref="updateModelFormRef" :rules="addModelRules">
      <el-form-item prop="name" label="场景名称">
        <el-input v-model="updateModelData.name" placeholder="请输入场景名称">
          <template #prefix>
            <el-icon><Menu /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="enable" label="是否启用">
        <el-switch
          v-model="updateModelData.enable"
          inline-prompt
          active-text="启用"
          inactive-text="禁用"
        >
        </el-switch>
      </el-form-item>
      <el-form-item prop="priority" label="优先级别">
        <el-tooltip
          effect="light"
          content="数字越小(-65525~65535),优先级越高"
          placement="bottom"
        >
          <el-input-number v-model="updateModelData.priority" :min="-65535" :max="65535" :step="1"></el-input-number>
        </el-tooltip>
      </el-form-item>
      <el-form-item prop="description" label="场景描述">
        <el-input type="textarea" maxlength="255" rows="5" v-model="updateModelData.description" show-word-limit>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="updateModel(updateModelFormRef)">
          确认
        </el-button>
        <el-button @click="updateModelDialogVisible=false">取消</el-button>
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
