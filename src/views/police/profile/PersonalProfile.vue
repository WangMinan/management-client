<script setup>
import {onMounted, ref} from 'vue'
import axios from '../../../api/request'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'
import {headers, createFileNameUUID} from '../../../utils/OssUtil.js'
import OSS from "ali-oss";


const router = useRouter()

const personalInformation = ref({})

const cardLoading = ref(false)

const fileList = ref([])

const getPersonalInformation = async () => {
  cardLoading.value = true
  try {
    const {data} = await axios.get('/backstage-management-service/police/profile')
    if (data.code !== 200){
      ElMessage.error(data.message)
    } else {
      personalInformation.value = data.data
    }
  } catch (e) {
    ElMessage.error('数据初始化失败')
  } finally {
    cardLoading.value = false
  }
}

let isEditing = ref(false)
let isUploadEnabled = ref(false)

const personalInformationFormRef = ref()

const abandonRevise = () => {
  router.go(0)
}

const uploadFile = async (params) => {
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(params.file.type)) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!')
    // 重置fileList
    fileList.value = []
  } else {
    try {
      // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
      // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
      const token = await axios.get('http://stsauth.wangminan.me/sts')
      const client = new OSS ({
        endpoint: 'oss-cn-hongkong.aliyuncs.com', //填写Bucket所在地域
        accessKeyId: token.data.AccessKeyId,
        accessKeySecret: token.data.AccessKeySecret,
        // STS临时授权
        stsToken: token.data.SecurityToken,
        bucket: 'wangminan-files', // 填写Bucket名称。
        useFetch: true, // 支持上传大于100KB的文件
        secure: true, // 返回的url为https
        refreshSTSToken: async () => {
          const refreshToken = await axios.get("http://stsauth.wangminan.me/sts");
          return {
            accessKeyId: refreshToken.AccessKeyId,
            accessKeySecret: refreshToken.AccessKeySecret,
            stsToken: refreshToken.SecurityToken,
          };
        },
      })
      // 使用临时访问凭证上传文件
      const result = await client.put(
          // 张三_uuid.jpg
          'police/' + personalInformation.value.name + '_'+ createFileNameUUID()+'.'+params.file.name.split('.')[1],
          params.file,
          {headers});
      isUploadEnabled.value = false
      personalInformation.value.imageUrl = result.url
    } catch (e) {
      ElMessage.error('数据上传失败')
    }
  }
}

const beginRevise = () => {
  isEditing.value = true
  isUploadEnabled.value = true
}

const personalInformationRules = {
  name: [
    {required: true, message: '请输入姓名', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
  ]
}

const reviseProfile = async (form) => {
  if(!form) return
  await form.validate(async (valid, fields) => {
    if(valid){
      cardLoading.value = true
      try{
        const {data} = await axios.put(`/backstage-management-service/police/profile/${personalInformation.value.id}`,
            personalInformation.value)
        if (data.code !== 200){
          ElMessage.error(data.message)
        } else {
          ElMessage.success('修改个人信息成功')
          isEditing.value = false
          // 当前页面包括header全部刷新
          router.go(0)
        }
      } catch (e) {
        ElMessage.error('数据初始化失败')
      } finally {
        // 刷新个人信息
        await getPersonalInformation()
        cardLoading.value = false
      }
    } else {
      ElMessage.error('请检查输入的信息')
    }
  })
}

onMounted(() => {
  getPersonalInformation()
})
</script>

<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/police/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>个人信息维护</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="informationCard">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-icon>
            <Edit />
          </el-icon>
          <span>个人信息</span>
        </div>
      </template>
      <el-form
        :model="personalInformation"
        v-loading="cardLoading"
        ref="personalInformationFormRef"
        :rules="personalInformationRules"
      >
        <el-empty v-if="personalInformation.length === 0" description="暂无数据"></el-empty>
        <el-form-item label="警员编号">
          <el-input
            v-model="personalInformation.accountNumber"
            :disabled="true"
          >
            <template #prefix>
              <el-icon>
                <Compass />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="警员姓名" prop="name">
          <el-input
            v-model="personalInformation.name"
            :disabled="!isEditing"
          >
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="警员照片">
          <el-image :src="personalInformation.imageUrl">
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
        <el-form-item label="所属监所">
          <el-input
            v-model="personalInformation.prisonName"
            :disabled="true"
          >
            <template #prefix>
              <el-icon>
                <OfficeBuilding />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="图片修改">
          <el-upload
              action="#"
              :http-request="uploadFile"
              accept="image/jpeg,image/jpg,image/png"
              :limit="1"
              :file-list="fileList"
              :disabled="!isUploadEnabled"
          >
            <el-button type="primary" :disabled="!isUploadEnabled">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传jpg/jpeg/png文件</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
        <el-button type="primary" :disabled="isEditing" @click="beginRevise">
          修改个人信息
        </el-button>
        <el-button type="success" :disabled="!isEditing" @click="reviseProfile(personalInformationFormRef)">
          <el-icon><Check /></el-icon>
          确认修改
        </el-button>
        <el-button type="info" :disabled="!isEditing" @click="abandonRevise">
          <el-icon><Close /></el-icon>
          取消修改
        </el-button>
      </span>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.informationCard{
  display: flex;
  justify-content: center;
  .el-card{
    text-align: center;
    width: 50%;
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
}
</style>
