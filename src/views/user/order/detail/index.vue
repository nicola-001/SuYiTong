<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {reqCancelOrder, reqOrderInfo, reqQrcode, reqQueryPayState} from "@/api/user";
import type {OrderInfo, OrderResponseData, PayResult} from "@/api/user/type";
import {ElMessage} from "element-plus";
// @ts-ignore
import QRCode from 'qrcode'

defineOptions({
  name: 'Detail'
})
// 存储数据
const orderInfo = ref<OrderInfo>()
const $route = useRoute()
// 控制对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
// 定义存储二维码图片的路径
let imgUrl = ref<string>('')
// 存储定时器的引用
let timmer=ref<any>()
// 获取详情的数据
const getOrderInfo = async () => {
  const result: OrderResponseData = await await reqOrderInfo($route.query.orderId as string)
  if (result.code === 200) {
    orderInfo.value = result.data
  }
}
onMounted(() => {
  getOrderInfo()
})
// 取消订单  orderStatus -1 取消预约  0 预约未支付 1支付成功
const cancel = async () => {
  console.log(123)
  try {
    await reqCancelOrder($route.query.orderId as string)
    getOrderInfo()
    ElMessage({
      type: 'success',
      message: '取消预约成功'
    })
  } catch (e) {
    ElMessage({
      type: 'error',
      message: '取消预约失败'
    })
  }
}
// 点击支付按钮的回调
const openDialog = async () => {
  // 打开弹出框
  dialogVisible.value = true
  //获取二维码
  const result = await reqQrcode($route.query.orderId as string)
  imgUrl.value = await QRCode.toDataURL(result.data.codeUrl)
//   询问服务器支付结果
 timmer.value= setInterval(async () => {
    const result: PayResult = await reqQueryPayState($route.query.orderId as string)
    //   如果服务器返回的数据data:true，代表支付成功
   if (result.data){
     dialogVisible.value = false
     // 提示消息
     ElMessage({
       type: 'success',
       message: '支付成功'
     })
     clearInterval(timmer.value)
     //  再次获取订单详情
     getOrderInfo()
   }
  }, 2000)
}
// 关闭窗口的回调
const closeDialog = () => {
  dialogVisible.value = false
  clearInterval(timmer.value)
}
// 对话框右上角关闭
const close=()=>{
  clearInterval(timmer.value)
}
</script>

<template>
  <div>
    <!--展示订单详情的结构-->
    <el-card class="box-card">
      <!--    卡片头部-->
      <template #header>
        <div class="detail">挂号详情</div>
      </template>
      <!-- 展示身体部分的顶部结构-->
      <div class="top">
        <!-- 左侧标签-->
        <el-tag class="ml-2" type="success">
          <div class="tag">
            <svg t="1727856805804" class="icon" viewBox="0 0 1035 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="4256" width="16" height="16">
              <path
                  d="M421.799069 833.016403c-11.405996 0-22.800853-4.355219-31.500152-13.054518L41.458121 471.132228c-17.398599-17.398599-17.398599-45.612844 0-63.011443s45.612844-17.398599 63.011443 0l317.329505 317.329504 508.714093-508.714093c17.398599-17.398599 45.612844-17.398599 63.011443 0s17.398599 45.612844 0 63.011444L453.31036 819.961885c-8.699299 8.699299-20.105295 13.054519-31.500152 13.054518z"
                  p-id="4257" fill="#77e67f"></path>
            </svg>


            <span>{{ orderInfo?.param.orderStatusString }}</span>
          </div>
        </el-tag>
        <!-- 右侧二维码-->
        <div class="right_info">
          <img src="../../../../assets/images/code_login_wechat.png" alt="">
          <div>
            <p>微信 关注“北京112预约挂号”</p>
            <p>“快速预约挂号”</p>
          </div>
        </div>
      </div>
      <!--订单详情底部结构-->
      <div class="bottom">
        <div class="left">
          <!-- 左侧展示订单详情信息-->
          <el-descriptions
              class="margin-top"
              :column="1"
              border
          >
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  就诊人信息：
                </div>
              </template>
              {{ orderInfo?.patientName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  就诊日期：
                </div>
              </template>
              {{ orderInfo?.reserveDate }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  就诊医院：
                </div>
              </template>
              {{ orderInfo?.hosname }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  就诊科室：
                </div>
              </template>
              {{ orderInfo?.depname }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  医生职称：
                </div>
              </template>
              {{ orderInfo?.title }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  医生服务费：
                </div>
              </template>
              <span style="color: red">{{ orderInfo?.amount }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  挂号单号：
                </div>
              </template>
              {{ orderInfo?.outTradeNo }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  挂号时间：
                </div>
              </template>
              {{ orderInfo?.createTime }}
            </el-descriptions-item>
          </el-descriptions>
          <div class="btn" v-if="orderInfo?.orderStatus==0||orderInfo?.orderStatus==1">
            <el-popconfirm title="确定取消预约？" @confirm="cancel">
              <template #reference>
                <el-button>取消预约</el-button>
              </template>
            </el-popconfirm>
            <el-button type="primary" v-if="orderInfo.orderStatus==0" @click="openDialog">支付</el-button>
          </div>
        </div>
        <div class="right">
          <el-card>
            <template #header>
              <div>注意事项</div>
            </template>
            <div>
              <p>1.请确认就诊人信息是否准确，若填写错误将无法取号就诊，损失由本人承担;</p>
              <p style="color: red">2.【取号】就诊当天需在{{ orderInfo?.fetchTime }}前
                在医院取号，未取号视为爽约，该号不退不换</p>
              <p>3、【退号】在{{ orderInfo?.quitTime }}前可在线退号，金期将不可办理退号退;</p>
              <p>
                4.北京114预约挂号支持自费患者使用身份证预约，同时支持北京市医保患者便用北京社保卡在平台预约挂号。请于就诊当日，携市预约挂号所使用的有效身份证件到院取号;</p>
              <p>5.请注意北京市医保患者在住院期间不能便用社保卡在门诊取号;</p>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
    <el-dialog
        v-model="dialogVisible" title="微信支付"
        width="400"
        @close="close"
    >
      <!-- 支付需要使用的二维码图片-->
      <div class="qrcode">
        <img :src="imgUrl" alt="">
        <p>请使用微信扫一扫</p>
        <p>扫描二维码支付</p>
      </div>
      <!--对话框底部插槽传递结构-->
      <template #footer>
        <el-button type="primary" @click="closeDialog">关闭窗口</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.box-card {
  .detail {
    color: #7f7f7f;
    font-weight: 900;
    font-size: 18px;
  }

  .top {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding: 10px;

    .tag {
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        margin-left: 5px;
      }

    }

    .right_info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }

      p {
        font-size: 14px;
        line-height: 20px;
      }
    }
  }

  .bottom {
    margin-top: 20px;
    display: flex;

    .left {
      flex: 4;

      .btn {
        margin-top: 10px;
      }
    }

    .right {
      flex: 6;
      margin-left: 20px;

      p {
        line-height: 30px;
      }
    }
  }
}

::v-deep(.el-dialog__body) {
  border-top: 1px solid #7f7f7f;
  border-bottom: 1px solid #7f7f7f;
}

.qrcode {
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    line-height: 30px;
  }
}
</style>