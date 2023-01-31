<script setup>
import {onMounted, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import axios from '../../../api/request'
import {putFile} from "../../../utils/OssUtil.js";
import {encrypt} from '../../../utils/jsencrypt.js'

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
    const {data} = await axios.get('/backstage-management-service/prison/police/query',{
      params: {
        query: queryInfo.value.query,
        pageNum: queryInfo.value.pageNum,
        pageSize: queryInfo.value.pageSize
      }
    })
    if (data.code === 2000) {
      policeList.value = data.data.list
      total.value = data.data.total
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

const policeSelection = ref({
  idList: []
})

const handleSelectionChange = (val) => {
  policeSelection.value.idList = val.map(item => item.id)
}

// 新增警员模块
const addPoliceDialogVisible = ref(false)
const addPoliceFormRef = ref()
const addDialogLoading = ref(false)
const addPoliceForm = ref({
  name: '',
  imageUrl: '',
  policeCode: ''
})
const addPoliceFormRules = ref({
  name: [
    {required: true, message: '请输入警员姓名', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ],
  imageUrl: [
    {required: true, message: '请上传警员照片', trigger: 'blur'}
  ],
  policeCode: [
    {required: true, message: '请输入警员编号', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ]
})
const fileList = ref([])
const resetAddForm = (form) => {
  if(!form) return
  form.resetFields()
}
// 上传前校验
const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
  const isPNG = file.type === 'image/png'
  const isLt3M = file.size / 1024 / 1024 < 3
  if (!isJPG && !isPNG) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!')
    // 重置fileList
    fileList.value = []
  }
  if (!isLt3M) {
    ElMessage.error('上传图片大小不能超过 3MB!')
    // 重置fileList
    fileList.value = []
  }
  return (isJPG || isPNG) && isLt3M
}
// 上传图片
// 限制上传数量
const handleChangePic = (file,fileList) => {
  if (fileList.length > 1) {
    fileList.splice(0, 1);
  }
}
let tmpFile
const uploadFile = async (params) => {
  try {
    tmpFile = params.file
    addPoliceForm.value.imageUrl = URL.createObjectURL(tmpFile)
    editPoliceForm.value.imageUrl = URL.createObjectURL(tmpFile)
  } catch (e) {
    ElMessage.error('图像更新失败')
  }
}
// 新增警员
const addPolice = async (form) => {
  if(!form) return
  await form.validate(async (valid, fields) => {
    if (valid) {
      try {
        addDialogLoading.value = true
        const addForm = {
          name: addPoliceForm.value.name,
          imageUrl: '',
          policeCode: addPoliceForm.value.policeCode
        }
        if (tmpFile) {
          const result = await putFile(addPoliceForm.value.name, tmpFile)
          addForm.imageUrl = result.url
        } else {
          addForm.imageUrl = addPoliceForm.value.imageUrl
        }
        const {data} = await axios.post('/backstage-management-service/prison/police', addForm)
        if (data.code === 2000) {
          ElMessage.success('新增警员成功')
          addPoliceDialogVisible.value = false
          fileList.value = []
          await getPoliceList()
        } else {
          ElMessage.error(data.msg)
        }
      } catch (e) {
        ElMessage.error('新增警员失败')
      } finally {
        addDialogLoading.value = false
      }
    } else {
      ElMessage.error('请检查输入的信息')
    }
  })
}

// 删除警员
const deletePolices = async () => {
  if (policeSelection.value.idList.length === 0) {
    ElMessage.error('请选择要删除的警员')
    return
  }
  ElMessageBox.confirm('此操作将永久删除选中的警员, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {data} =
      await axios.delete('/backstage-management-service/prison/police',
        {
          data: {
            idList: policeSelection.value.idList
          }
        })
    if(data.code === 2000) {
      ElMessage.success('删除成功')
      await getPoliceList()
    } else {
      ElMessage.error(data.msg)
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 展示警员信息
const showPoliceDialogVisible = ref(false)
const showPoliceForm = ref({})
const showCheckDialog = (id) => {
  showPoliceDialogVisible.value = true
  showPoliceForm.value = policeList.value.find(item => item.id === id)
}

// 修改警员信息
const editPoliceDialogVisible = ref(false)
const editPoliceForm = ref({})
const editDialogLoading = ref(false)
const editPoliceFormRef = ref()
const editPoliceRules = ref({
  name: [
    {required: true, message: '请输入警员姓名', trigger: 'blur'},
    {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
  ],
  prisonName:[
    {required: true, message: '请输入监所名称', trigger: 'blur'}
  ],
  imageUrl: [
    {required: true, message: '请上传警员照片', trigger: 'blur'}
  ]
})
const prisonList = ref([])
const getPrisonList = async () => {
  try {
    const {data} = await axios.get('/backstage-management-service/prison/prison')
    if(data.code === 2000){
      prisonList.value = data.data
    } else {
      ElMessage.error(data.msg)
    }
  } catch (e) {
    ElMessage.error('获取监所列表失败')
  }
}
const showUpdateDialog = (id) => {
  editPoliceDialogVisible.value = true
  editPoliceForm.value = policeList.value.find(item => item.id === id)
}
const submitEdit = async (form) => {
  if(!form) return
  await form.validate(async (valid, fields) => {
    if (valid) {
      try {
        editDialogLoading.value = true
        const uploadForm = {
          name: editPoliceForm.value.name,
          prisonName: editPoliceForm.value.prisonName,
          imageUrl: '',
        }
        if (tmpFile) {
          const result = await putFile(editPoliceForm.value.name, tmpFile)
          uploadForm.imageUrl = result.url
        } else {
          uploadForm.imageUrl = editPoliceForm.value.imageUrl
        }
        const {data} = await axios.put(`/backstage-management-service/prison/police/${editPoliceForm.value.id}`,
            uploadForm)
        if (data.code === 2000) {
          ElMessage.success('修改警员成功')
          editPoliceDialogVisible.value = false
          fileList.value = []
          await getPoliceList()
        } else {
          ElMessage.error(data.message)
        }
      } catch (e) {
        ElMessage.error('修改警员失败')
      } finally {
        editDialogLoading.value = false
      }
    } else {
      ElMessage.error('请检查输入的信息')
    }
  })
}

const closeDialog = (form) => {
  form.resetFields()
  fileList.value = []
}

onMounted(async () => {
  await getPoliceList()
  await getPrisonList()
})
</script>

<template>
  <!--面包屑导航-->
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/prison/home' }">首页</el-breadcrumb-item>
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
  <!--添加警员弹窗-->
  <el-dialog
    title="添加警员"
    v-model="addPoliceDialogVisible"
    @closed="closeDialog(addPoliceFormRef)"
    center
  >
    <div>警员登录初始密码同警号</div>
    <el-form
      :model="addPoliceForm"
      :rules="addPoliceFormRules"
      ref="addPoliceFormRef"
    >
      <el-form-item prop="name" label="警员姓名">
        <el-input v-model="addPoliceForm.name" placeholder="请输入警员姓名">
          <template #prefix>
            <el-icon><User/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="policeCode" label="警员编号">
        <el-input v-model="addPoliceForm.policeCode" placeholder="请输入警员编号">
          <template #prefix>
            <el-icon><Aim /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="imageUpload" prop="imageUrl" label="警员照片">
        <el-image :src="addPoliceForm.imageUrl">
          <template #placeholder>
            <span>加载中</span>
          </template>
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
      </el-form-item>
      <el-form-item label="图片上传">
        <el-upload
          :before-upload="beforeUpload"
          action="#"
          :http-request="uploadFile"
          accept="image/jpeg,image/jpg,image/png"
          multiple
          :file-list="fileList"
          :on-change="handleChangePic"
        >
          <el-button type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传jpg/jpeg/png文件</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="addPolice(addPoliceFormRef)" :loading="addDialogLoading">
          确认
        </el-button>
        <el-button @click="addPoliceDialogVisible=false">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <!--展示警员信息弹窗-->
  <el-dialog
    title="警员信息查看"
    v-model="showPoliceDialogVisible"
    center
  >
    <el-form
      :disabled="true"
      :model="showPoliceForm"
    >
      <el-form-item prop="accountNumber" label="警员编号">
        <el-input v-model="showPoliceForm.accountNumber" placeholder="请输入警员编号">
          <template #prefix>
            <el-icon><Aim /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="name" label="警员姓名">
        <el-input v-model="showPoliceForm.name" placeholder="请输入警员姓名">
          <template #prefix>
            <el-icon><User/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="image" label="警员相片">
        <el-image :src="showPoliceForm.imageUrl" style="width: 150px; height: 200px"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showPoliceDialogVisible=false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <!--修改警员信息弹窗-->
  <el-dialog
    title="警员信息修改"
    v-model="editPoliceDialogVisible"
    center
    @closed="closeDialog(editPoliceFormRef)"
  >
    <el-form
      :model="editPoliceForm"
      ref="editPoliceFormRef"
      :rules="editPoliceRules"
    >
      <el-form-item prop="name" label="警员姓名">
        <el-input v-model="editPoliceForm.name" placeholder="请输入警员姓名">
          <template #prefix>
            <el-icon><User/></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="prisonName" label="监所名称">
        <el-select filterable v-model="editPoliceForm.prisonName" placeholder="请选择监所名称">
          <template #prefix>
            <el-icon><OfficeBuilding/></el-icon>
          </template>
          <el-option
            v-for="item in prisonList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="imageUrl" label="警员相片">
        <el-image :src="editPoliceForm.imageUrl" style="width: 150px; height: 200px"/>
      </el-form-item>
      <el-form-item label="图片修改">
        <el-upload
          action="#"
          :http-request="uploadFile"
          accept="image/jpeg,image/jpg,image/png"
          :limit="1"
          :file-list="fileList"
          :before-upload="beforeUpload"
        >
          <el-button type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传jpg/jpeg/png文件</div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitEdit(editPoliceFormRef)" :loading="editDialogLoading">
          确认
        </el-button>
        <el-button type="info" @click="editPoliceDialogVisible = false">
          取消
        </el-button>
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
.imageUpload{
  .el-image{
    width: 150px;
    height: 200px;
    .image-slot{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-secondary);
      font-size: 30px;
    }
  }
}
</style>
