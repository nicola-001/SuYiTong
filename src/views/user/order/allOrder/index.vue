<script setup lang="ts">
import {onMounted, ref} from "vue";
import {reqAllUser, reqOrderState, reqUserOrderInfo} from "@/api/user";
import type {Records, UserOrderInfoResponseData} from "@/api/user/type";
import {useRouter} from "vue-router";

defineOptions({
  name: 'AllOrder'
})
const pageNo = ref(1)
const pageSize = ref(10)
const total = ref(0)
// 收紧就诊人id
const patientId = ref('')
// 订单状态
const orderStatus = ref('')
// 存储服务器返回的数据
const allOrderArr = ref<Records>()
const $router = useRouter()
// 存储所有就诊人信息
const allUser = ref<any>([])
// 存储订单状态
const allOrderState = ref<any>([])
// 获取订单请求
const getUserOrderInfo = async () => {
  const result: UserOrderInfoResponseData = await reqUserOrderInfo(pageNo.value, pageSize.value, patientId.value, orderStatus.value)
  if (result.code == 200) {
    allOrderArr.value = result.data.records
    total.value = result.data.total
  }
}
onMounted(() => {
  getUserOrderInfo()
//   获取全部就诊人信息以及订单状态
  getData()
})
// 详情按钮的回调
const goDetail = (row: any) => {
  console.log(row)
  $router.push({path: '/user/order', query: {orderId: row.id}})
}
// 分页器组件当前页码发生变化的时候触发
const handlerChange = (pager: number) => {
  pageNo.value = pager
  getUserOrderInfo()
}
// 下拉菜单的回调
const handler = (size: number) => {
  pageSize.value = size
  getUserOrderInfo()
}
//   获取全部就诊人信息以及订单状态
const getData = async () => {
  const result1: any = await reqAllUser()
  const result2: any = await reqOrderState()
  allUser.value = result1.data
  allOrderState.value = result2.data
}
// 就诊人下拉菜单的回掉方法
const changeUser = () => {
  getUserOrderInfo()
}
const chengeState = () => {
  getUserOrderInfo()
}
</script>

<template>
  <!-- 展示全部订单的结构-->
  <el-card>
    <template #header>
      <div class="card-header">
        <span>挂号订单</span>
      </div>
    </template>
    <!--提供用户选择的下拉菜单-->
    <el-form :inline="true">
      <el-form-item label="就诊人" style="width: 300px;">
        <el-select placeholder="请选择就诊人" v-model="patientId" @change="changeUser">
          <el-option label="请选择全部就诊人" value=""></el-option>
          <el-option v-for="item in allUser" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" style="width: 300px;">
        <el-select placeholder="请选择订单状态" v-model="orderStatus" @change="chengeState">
          <el-option label="全部订单" value=""></el-option>
          <el-option v-for="(item,index) in allOrderState" :key="index" :label="item.comment"
                     :value="item.status"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--表格展示订单数据-->
    <el-table border style="margin: 10px 0" :data="allOrderArr">
      <el-table-column label="就诊时间" prop="reserveDate"></el-table-column>
      <el-table-column label="医院" prop="hosname"></el-table-column>
      <el-table-column label="科室" prop="depname"></el-table-column>
      <el-table-column label="医生" prop="title"></el-table-column>
      <el-table-column label="服务费" prop="amount"></el-table-column>
      <el-table-column label="就诊人" prop="patientName"></el-table-column>
      <el-table-column label="订单状态" prop="param.orderStatusString"></el-table-column>
      <el-table-column label="操作">
        <template #="{row}">
          <el-button type="text" @click="goDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        layout=" prev, pager, next, jumper,->,sizes,total"
        :total="total"
        @current-change="handlerChange"
        @size-change="handler"
    />
  </el-card>
</template>

<style scoped lang="scss">

</style>