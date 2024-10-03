<script setup lang="ts">
import {InfoFilled} from "@element-plus/icons-vue";
import {reqCertationType, reqUserCertation, reqUserInfo} from "@/api/user";
import {onMounted, reactive, ref} from "vue";
import type {UserParams} from "@/api/user/type";
import {ElMessage, type UploadFile} from "element-plus";

defineOptions({
  name: 'Certification',
})
// 存储用户信息
const userInfo = ref<any>({})
// 存储用户数据类型
const arrType = ref<any>([])
// 收集用户表单认证的数据
let params = reactive<UserParams>({
  certificatesNo: '',
  certificatesType: '',
  certificatesUrl: '',
  name: ''
})
let upload = ref()
let form = ref()
// 控制对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 获取用户信息
const getUserInfo = async () => {
  const result: any = await reqUserInfo()
  if (result.code == 200) {
    userInfo.value = result.data
  }
}
// 获取证件类型的接口
const getType = async () => {
  const result: any = await reqCertationType()
  if (result.code == 200) {
    arrType.value = result.data
  }
}
onMounted(() => {
  getUserInfo()
  getType()
})
//超出数量的钩子
const exceedhandler = () => {
  ElMessage({
    type: 'error',
    message: '只能上传一张图片'
  })
}
// 图片上传成功的钩子
const successhandler = (res: any, uploadFile: UploadFile, uploadFiles: any) => {
  // 收集上传成功的图片的地址
  params.certificatesUrl = res.data
  // UploadFile上传文件对象
  // uploadFiles上传文件的所有对象
  form.value.clearValidate('certificatesUrl')
}
// 预览的钩子
const previewhandler = (uploadFile: UploadFile, uploadFiles: any) => {
  dialogVisible.value = true
}
// 照片墙删除图片的钩子
const handlerRemove = () => {
  params.certificatesUrl = ''
}
// 重写按钮的回调
const reset = () => {
  Object.assign(params, {
    certificatesNo: '',
    certificatesType: '',
    certificatesUrl: '',
    name: ''
  })
  upload.value.clearFiles()
}
// 提交按钮的回调
const submit = async () => {
  // 全部表单校验
  await form.value.validate()
  try {
    await reqUserCertation(params)
    ElMessage({
      type: 'success',
      message: '认证成功'
    })
    await getUserInfo()
  } catch (e) {
    ElMessage({
      type: 'error',
      message: '认证失败'
    })
  }

}
// 自定义名字
const validatorName = (rule: any, value: any, callback: any) => {
  let reg = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/;
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的中国人的名字'))
  }
}
// 证件类型的方法
const validatorType = (rule: any, value: any, callback: any) => {
  if (value == '10' || value == '20') {
    callback()
  } else {
    callback(new Error('请选择证件类型'))
  }
}
// 证件号码
const certificatesNo = (rule: any, value: any, callback: any) => {
  let sfz = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  let hkb = /^\d{9}/
  if (sfz.test(value) || hkb.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的身份证或户口本的号码'))
  }
}
// 证件图片
const certificatesUrl = (rule: any, value: any, callback: any) => {
  if (value.length) {
    callback()
  } else {
    callback(new Error('请上传证件照图片'))
  }
}

// 校验规则对象
// required:true 当前字段必须校验
const rules = {
  // 用户姓名的校验
  name: [
    {
      required: true, validator: validatorName
    }
  ],
  certificatesType: [
    {
      required: true, validator: validatorType
    }
  ],
  certificatesNo: [
    {
      required: true, validator: certificatesNo
    }
  ],
  certificatesUrl: [
    {
      required: true, validator: certificatesUrl
    }
  ],
}
</script>

<template>
  <!--  实名认证组件-->
  <el-card class="box-card">
    <!--    头部-->
    <template #header>
      <div class="card-header">
        <span>实名信息</span>
      </div>
    </template>
    <!-- 实名认证提示部分-->
    <div class="tip">

      <p>
        <el-icon>
          <InfoFilled/>
        </el-icon>
        完成实名认证后才能添加就诊人，正常进行挂号，为了不影响后续步骤，建议提前实名认证。
      </p>
    </div>
    <!-- 身体底部：认证成功的结构-->
    <el-descriptions
        v-if="userInfo.authStatus==1"
        class="margin-top"
        :column="1"
        border
        size="small"
        style="margin: 20px auto"
    >
      <el-descriptions-item label-align="center" :width="20">
        <template #label>
          <div class="cell-item">
            用户姓名：
          </div>
        </template>
        {{ userInfo.name }}
      </el-descriptions-item>
      <el-descriptions-item label-align="center" :width="20">
        <template #label>
          <div class="cell-item">
            证件类型：
          </div>
        </template>
        {{ userInfo.certificatesType == '10' ? '身份证' : '户口本' }}
      </el-descriptions-item>
      <el-descriptions-item label-align="center" :width="20">
        <template #label>
          <div class="cell-item">
            证件号码：
          </div>
        </template>
        {{ userInfo.certificatesNo }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- 未验证的结构-->
    <el-form
        v-if="userInfo.authStatus==0"
        style="width: 60%;
        margin: 20px auto"
        label-width="80"
        :model="params"
        :rules="rules"
        ref="form"
    >
      <el-form-item label="用户姓名" prop="name">
        <el-input placeholder="请输入用户姓名" v-model="params.name"></el-input>
      </el-form-item>
      <el-form-item label="证件类型" prop="certificatesType">
        <el-select placeholder="请选择证件类型" v-model="params.certificatesType">
          <el-option :label="item.name" :value="item.value" v-for="(item,index) in arrType" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码" prop="certificatesNo">
        <el-input placeholder="请输入证件号码" v-model="params.certificatesNo"></el-input>
      </el-form-item>
      <el-form-item label="上传证件" prop="certificatesUrl">
        <el-upload
            ref="upload"
            list-type="picture-card"
            action="/api/oss/file/fileUpload?fileHost=userAuah"
            :limit="1"
            :on-exceed="exceedhandler"
            :on-success="successhandler"
            :on-preview="previewhandler"
            :on-remove="handlerRemove"
        >
          <img style="width: 100%;height: 100%;" src="../../../assets/images/auth_example.png" alt="">
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full v-if="params.certificatesUrl" :src="params.certificatesUrl" style="width: 100%;height: 100%;"
               alt="Preview Image"/>
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重写</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped lang="scss">
.box-card {
  .tip {
    color: #7f7f7f;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>