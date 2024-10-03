<script setup lang="ts">
import {User} from "@element-plus/icons-vue";
import Visitor from "@/components/visitor/visitor.vue";
import {reqGetUser} from "@/api/hospital";
import {onMounted, reactive, ref, watch} from "vue";
import type {UserArr, UserResponseData} from "@/api/hospital/type";
import {reqAddOrUpdateUser, reqCertationType, reqCity} from "@/api/user";
import {type CascaderProps, ElMessage} from "element-plus";
import type {AddOrUpdateData} from "@/api/user/type";
import {useRoute, useRouter} from "vue-router";

defineOptions({
  name: 'Patient'
})
// 存储就诊人信息
const userArr = ref<UserArr>([])
// 卡片身体部分展示什么结构
let scene = ref<number>(0)
const $router = useRouter()
const $route = useRoute()
// 收集就诊人的数据
let userParams = reactive<AddOrUpdateData>({
  name: '',
  certificatesType: '',
  contactsCertificatesNo: '',
  sex: 0,
  birthdate: '',
  phone: '',
  isMarry: 0,
  isInsure: 0,
  addressSelected: [],
  address: '',
  contactsName: '',
  contactsCertificatesType: '',
  certificatesNo: '',
  contactsPhone: '',
})
const getUser = async () => {
  const result: UserResponseData = await reqGetUser()
  if (result.code == 200) {
    userArr.value = result.data
  }
}
// 存储证件类型的数据
const certationArr = ref<any>([])
onMounted(() => {
  getUser()
//   获取证件类型
  getCertationType()
//   判断路由上是否有type=add
  if ($route.query.type == 'add') {
    scene.value = 1
  }
//   判断路由上是否有type=edit
  if ($route.query.type == 'edit') {
    scene.value = 1
  }
})
// 监听全部就诊人的数据
watch(() => userArr.value,
    (newVal, oldVal) => {
      if ($route.query.type == 'edit') {
        let user = userArr.value.find((item: any) => {
          return item.id == $route.query.id
        })
        Object.assign(userParams, user)
      }
    })
const reset = () => {
  Object.assign(userParams, {
    id:null,
    name: '',
    certificatesType: '',
    contactsCertificatesNo: '',
    sex: 0,
    birthdate: '',
    phone: '',
    isMarry: 0,
    isInsure: 0,
    addressSelected: [],
    address: '',
    contactsName: '',
    contactsCertificatesType: '',
    certificatesNo: '',
    contactsPhone: '',
  })
}
// 添加就诊人的回调
const addUser = () => {
  // 清空上一次的数据
  reset()
  // 切换场景为 1
  scene.value = 1
}
// 就诊人子组件自定义事件的回调
const chengeScene = (user: any) => {
  scene.value = 1
  // 收集已有的就诊人信息
  Object.assign(userParams, user)
}
// 获取证件类型
const getCertationType = async () => {
  const result: any = await reqCertationType()
  if (result.code == 200) {
    certationArr.value = result.data
  }
}
// 级联选择器的数据
const props: CascaderProps = {
  lazy: true,//懒加载数据
  // 级联选择器的方法
  async lazyLoad(node, resolve) {
    const result = await reqCity((node.data?.id as string) || '86')
    //   整理数据
    let showData = result.data.map((item: any) => {
      return {
        id: item.id,
        label: item.name,
        value: item.value,
        leaf: !item.hasChildren
      }
    })
    //   注入组件需要的数据
    resolve(showData)
  },
}
// 提交按钮方法的回调
const submit = async () => {
//   更新或新增就诊人
  try {
    await reqAddOrUpdateUser(userParams)
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '新增成功'
    })
    if ($route.query.type) {
      $router.back()
    } else {
      scene.value = 0
    }
    await getUser()
  } catch (e) {
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '新增失败'
    })
  }
}
const removeUser=()=>{
  getUser()
}
</script>

<template>
  <!--  就诊人组件静态结构-->
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>就诊人管理</span>
        <el-button type="success" :icon="User" @click="addUser">添加就诊人</el-button>
      </div>
    </template>
    <!--就诊人管理模块展示就诊人管理的结构-->
    <div v-if="scene==0" class="visitors">
      <Visitor @chengeScene="chengeScene" @removeUser="removeUser" class="items" v-for="(user,index) in userArr" :key="user.id" :user="user"
               :index="index"/>
    </div>
    <!--添加就诊人或修改已有的就诊人信息的结构-->
    <div class="form" v-if="scene==1">
      <el-divider content-position="left">就诊人信息</el-divider>
      <!-- 就诊人信息-->
      <el-form style="width: 60%;margin: 10px auto" label-width="80">
        <el-form-item label="用户姓名">
          <el-input placeholder="请输入用户姓名" v-model="userParams.name"/>
        </el-form-item>
        <el-form-item label="证件类型" style="width: 100%">
          <el-select placeholder="请你选择证件类型" v-model="userParams.certificatesType">
            <el-option v-for="item in certationArr" :key="item.id" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input placeholder="请输入证件号码" v-model="userParams.certificatesNo"/>
        </el-form-item>
        <el-form-item label="用户性别">
          <el-radio-group v-model="userParams.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
              type="date"
              placeholder="请你选择日期"
              v-model="userParams.birthdate"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input placeholder="请输入手机号码" v-model="userParams.phone"/>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">建档信息(完善后部分医院首次就诊不排队建档)</el-divider>
      <!-- 建档信息-->
      <el-form style="width: 60%;margin: 10px auto" label-width="80">
        <el-form-item label="婚姻状况">
          <el-radio-group v-model="userParams.isMarry">
            <el-radio :label="1">已婚</el-radio>
            <el-radio :label="0">未婚</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自费/医保">
          <el-radio-group v-model="userParams.isInsure">
            <el-radio :label="1">自费</el-radio>
            <el-radio :label="0">医保</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当前住址">
          <el-cascader :props="props" v-model="userParams.addressSelected"/>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input placeholder="请输入详细地址" v-model="userParams.address"/>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">联系人信息(选填)</el-divider>
      <!-- 联系人信息-->
      <el-form style="width: 60%;margin: 10px auto" label-width="80">
        <el-form-item label="用户姓名">
          <el-input placeholder="请输入用户姓名" v-model="userParams.contactsName"/>
        </el-form-item>
        <el-form-item label="证件类型" style="width: 100%">
          <el-select placeholder="请你选择证件类型" v-model="userParams.contactsCertificatesType">
            <el-option v-for="item in certationArr" :key="item.id" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input placeholder="请输入证件号码" v-model="userParams.contactsCertificatesNo"/>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input placeholder="请输入手机号码" v-model="userParams.contactsPhone"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="reset">重写</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.box-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .visitors {
    display: flex;
    flex-wrap: wrap;

    .items {
      width: 32% !important;
      margin: 5px;
    }
  }
}
</style>