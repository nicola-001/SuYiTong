<script setup lang="ts">

import {Avatar} from "@element-plus/icons-vue";
import Visitor from "@/components/visitor/visitor.vue";
import {reqDoctorInfo, reqGetUser} from "@/api/hospital";
import {onMounted, ref} from "vue";
import type {DoctorInfoData, UserArr, UserResponseData} from "@/api/hospital/type";
import {useRoute, useRouter} from "vue-router";
import {reqSubmitOrder} from "@/api/user";
import type {SubmitOrder} from "@/api/user/type";
import {ElMessage} from "element-plus";

// 获取路由对象
const $route = useRoute()
// 获取路由器对象
const $router = useRouter()
// 存储全部就诊人信息
let userArr = ref<UserArr>([])
// 存储医生信息
let docInfo = ref<any>({})
// 获取就诊人
const fetchUserData = async () => {
  const result: UserResponseData = await reqGetUser()
  if (result.code == 200) {
    userArr.value = result.data
  }
}
const fetchInfo = async () => {
  const result: DoctorInfoData = await reqDoctorInfo($route.query.docId as string)
  if (result.code == 200) {
    docInfo.value = result.data
  }
}
//
onMounted(() => {
  // 获取就诊人信息
  fetchUserData()
//   获取医生信息
  fetchInfo()
})
// 定义一个索引值用于存储已选择的就诊人
const currentIndex = ref<number>(-1)
// 修改索引值的回调
const chengeIndex = (index: number) => {
  // 保存当前已选的值
  currentIndex.value = index
}
// 确定挂号按钮的回调
const submitOrder = async () => {
  // 医院编号
  let hoscode = docInfo.value.hoscode
  // 医生id
  let scheduleId = docInfo.value.id
  // 就诊人id
  let patientId = userArr.value[currentIndex.value].id
  const result: SubmitOrder = await reqSubmitOrder(hoscode, scheduleId, patientId)
  // 提交订单成功
  if (result.code == 200) {
    $router.push({path: '/user/order', query: {orderId: result.data}})
  } else {
    ElMessage({
      type: "error",
      message: '提交订单失败'
    })
  }
}
// 添加就诊人
const goUser = () => {
  $router.push({path: '/user/patient', query: {type: 'add'}})
}
</script>

<template>
  <div class="container">
    <h1 class="tip">确认挂号信息</h1>
    <!--  卡片：展示就诊人信息-->
    <el-card class="box-card">
      <!--卡片的头部-->
      <template #header>
        <div class="card-header">
          <span>请选择就诊人</span>
          <el-button type="success" :icon="Avatar" @click="goUser">添加就诊人</el-button>
        </div>
      </template>
      <!-- 卡片身体部分封装成一个组件-->
      <div class="user">
        <Visitor @click="chengeIndex(index)" v-for="(user,index) in userArr" :key="user.id" class="item" :user="user"
                 :index="index" :currentIndex="currentIndex"/>
      </div>
    </el-card>
    <!--   卡片：展示医生的信息-->
    <el-card class="box-card">
      <!--卡片头部-->
      <template #header>
        <div class="card-header">
          <span>挂号信息</span>
        </div>
      </template>
      <!-- 卡片身体部分-->
      <el-descriptions
          class="margin-top"
          :column="2"
          border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              就诊日期：
            </div>
          </template>
          {{ docInfo.workDate }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              就诊医院：
            </div>
          </template>
          {{ docInfo.param?.hosname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              就诊科室：
            </div>
          </template>
          {{ docInfo.param?.depname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              医生姓名：
            </div>
          </template>
          {{ docInfo.docname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              医生职称：
            </div>
          </template>
          {{ docInfo.title }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              医生专长：
            </div>
          </template>
          {{ docInfo.skill }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              服务费：
            </div>
          </template>
          <span style="color: red">{{ docInfo.amount }}</span>
        </el-descriptions-item>

      </el-descriptions>
    </el-card>
    <!-- 确定挂号按钮-->
    <div class="btn">
      <el-button type="primary"
                 :disabled="currentIndex==-1"
                 @click="submitOrder"
      >确认挂号
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  .tip {
    color: #7f7f7f;
    font-size: 20px;
  }

  .box-card {
    margin: 20px 0;

    span {
      font-size: 18px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .user {
      display: flex;
      flex-wrap: wrap;

      .item {
        width: 32% !important;
        margin: 5px;
      }
    }
  }

  .btn {
    display: flex;
    justify-content: center;
  }
}
</style>