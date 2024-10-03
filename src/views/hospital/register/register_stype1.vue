<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {reqHospitalDoctor, reqHospitalWork} from "@/api/hospital";
import {useRoute, useRouter} from "vue-router";
import type {DocArr, Doctor, DoctorResponseData, HospitalWorkData} from "@/api/hospital/type";

defineOptions({
  name: "register_stype1",
})
// 获取路由对象
const $route = useRoute()
// 获取路由器对象
const $router=useRouter()
let pageNo = ref<number>(1)
let limit = ref<number>(6)
// 存储排班日期：当前数据的第一个
const workTime: any = ref({})
// 存储医院科室挂号的数据
const workData = ref<any>({})
// 存储医生排班的数据
let docArr = ref<DocArr>([])
const fetchWorkData = async () => {
  const result: HospitalWorkData = await reqHospitalWork(pageNo.value, limit.value, ($route.query.hoscode as string), ($route.query.depcode as string))
  if (result.code == 200) {
    workData.value = result.data
    //   存储排班日期（当前数据的第一个）
    workTime.value = workData.value.bookingScheduleList[0]

    await getDoctorWorkData()
  }
}
// 获取医生排班的数据
const getDoctorWorkData = async () => {
  // 医院编号
  let hoscode = $route.query.hoscode as string
  // 科室编号
  let depcode = $route.query.depcode as string
  // 工作时间
  const workData = workTime.value.workDate
  const result: DoctorResponseData = await reqHospitalDoctor(hoscode, depcode, workData)
  if (result.code == 200) {
    docArr.value = result.data
  }
}
onMounted(() => {
  fetchWorkData()
})
// 点击顶部某一天的时候触发回调
const changeTime = (item: any) => {
  // 存储用户选择哪一天的数据
  workTime.value = item
  // 获取医生排班的数据
  getDoctorWorkData()
}
// 计算出上午医生排班的数据
let moringArr = computed(() => {
  return docArr.value.filter((doc: Doctor) => {
    return doc.workTime == 0
  })
})
// 计算出下午医生排班的数据
let afterArr = computed(() => {
  return docArr.value.filter((doc: Doctor) => {
    return doc.workTime == 1
  })
})
// 路由跳转进入到选择就诊人的页面
const goStep2=(doctor:Doctor)=>{
  console.log(123,doctor)
  $router.push({path:'/hospital/register_stype2',query:{docId:doctor.id}})
}
</script>

<template>
  <div class="wrap">
    <!--顶部结构-->
    <div class="top">
      <div class="hosname">{{ workData.baseMap?.hosname }}</div>
      <div class="line"></div>
      <div>{{ workData.baseMap?.bigname }}</div>
      <div class="dot">.</div>
      <div class="hosdepartment">{{ workData.baseMap?.depname }}</div>
    </div>
    <!--中间展示日期的结构-->
    <div class="center">
      <h1>{{ workData.baseMap?.workDateString }}</h1>
      <div class="container">
        <div class="item"
             :class="{active:item.status==-1||item.availableNumber==-1,cur:item.workDate==workTime.workDate}"
             v-for="(item,index) in workData.bookingScheduleList"
             :key="index"
             @click="changeTime(item)"
        >
          <div class="top1">{{ item.workDate }}-{{ item.dayOfWeek }}</div>
          <div class="bottom">
            <div>
              <div v-if="item.status==-1">停止挂号</div>
              <div v-if="item.status==0">
                {{ item.availableNumber == -1 ? '约满了' : `有号(${item.availableNumber})` }}
              </div>
              <div v-if="item.status==1">
                即将放号
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-pagination v-model:current-page="pageNo" @current-change="fetchWorkData" layout="prev, pager, next"
                     :total="workData.total"/>
    </div>
    <!--底部展示医生的结构-->
    <div class="bottom">
      <!--展示即将放号的时间-->
      <div class="will" v-if="workTime.status==1">
        <span class="time">2024年9月29日 20:50:09</span><span class="time">放号</span>
      </div>
      <!--展示医生的结构-->
      <div class="doctor" v-else>
        <div class="moring">
          <!--顶部文字的提示-->
          <div class="tip">
            <svg t="1727614502670" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="5530" width="32" height="32">
              <path
                  d="M904.101037 676.946871H118.670712c-15.461511 0-28.105271-12.535384-28.105271-28.033021 0-15.461511 12.643759-28.105271 28.105271-28.10527h785.430325c15.461511 0 28.105271 12.643759 28.105271 28.10527s-12.607634 28.033021-28.105271 28.033021z m-56.029916-324.980738c-11.018133 10.945883-28.719396 10.945883-39.665279 0-11.018133-10.945883-11.018133-28.755521 0-39.665279l39.665279-39.665279a27.97522 27.97522 0 0 1 39.593029 0 27.93187 27.93187 0 0 1 0 39.665279l-39.593029 39.665279z m-62.279545 212.776406c-26.082269-128.027094-138.683977-224.444789-274.441826-224.44479-135.649474 0-248.287307 96.417696-274.369576 224.44479H177.915755c21.602766-158.263741 162.454244-280.583081 333.433995-280.583081 171.088125 0 311.903478 122.31934 333.506244 280.583081h-59.064418z m-274.441826-336.612997c-15.461511 0-28.033021-12.535384-28.033021-28.10527V143.95823c0-15.461511 12.535384-28.105271 28.033021-28.10527 15.569886 0 28.105271 12.643759 28.10527 28.10527v56.029916c0 15.606011-12.535384 28.141396-28.10527 28.141396zM174.700628 351.966133L135.035349 312.264729c-10.945883-10.945883-10.945883-28.755521 0-39.665279 11.018133-10.945883 28.719396-10.945883 39.665279 0l39.665279 39.665279a27.93187 27.93187 0 0 1 0 39.665279c-10.909758 10.982008-28.647146 10.982008-39.665279 0.036125z m-28.033021 381.119029h729.40041c15.497636 0 28.033021 12.535384 28.03302 28.03302a28.033021 28.033021 0 0 1-28.03302 28.033021H146.667607c-15.497636 0-28.033021-12.535384-28.03302-28.033021 0.036125-15.497636 12.571509-28.033021 28.03302-28.03302z m84.171312 112.168207h561.093911c15.497636 0 28.033021 12.535384 28.033021 28.033021 0 15.569886-12.535384 28.105271-28.033021 28.10527H230.838919c-15.497636 0-28.033021-12.535384-28.03302-28.10527 0-15.497636 12.535384-28.033021 28.03302-28.033021z"
                  fill="#1296db" p-id="5531"></path>
            </svg>
            <span class="text">上午号源</span>
          </div>
          <!--每一个医生的信息-->
          <div class="doc_info" v-for="doctor in moringArr" :key="doctor.id">
            <!--展示医生的名字|技能-->
            <div class="left">
              <div class="info">
                <span>{{ doctor.title }}</span>
                <span>|</span>
                <span>{{ doctor.docname }}</span>
              </div>
              <div class="skill">
                {{doctor.skill}}
              </div>
            </div>
            <!--挂号的钱数-->
            <div class="right">
              <div class="money">¥{{doctor.amount}}</div>
              <el-button type="primary" @click="goStep2(doctor)">剩余{{doctor.availableNumber}}</el-button>
            </div>
          </div>
        </div>
        <div class="moring" v-for="doctor in afterArr" :key="doctor.id">
          <!--顶部文字的提示-->
          <div class="tip">
            <svg t="1727615405007" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 p-id="6966" width="32" height="32">
              <path
                  d="M181.9648 406.3744h644.5568v160.2048a322.2528 322.2528 0 0 1-322.2528 322.2528 322.2528 322.2528 0 0 1-322.2528-322.2528V406.3744z"
                  fill="#1296db" p-id="6967"></path>
              <path
                  d="M916.1216 391.1168c-20.48-22.3744-49.9712-22.3744-62.464-22.3744h-76.8V346.112a25.6 25.6 0 0 0-25.6-25.6H106.5472a25.6 25.6 0 0 0-25.6 25.6v160.1536a347.648 347.648 0 0 0 610.5088 227.7888c78.7968-8.96 140.7488-37.9904 184.32-86.528 45.5168-51.2 59.0336-110.5408 62.4128-151.6032 3.8912-50.8416-3.0208-84.1216-22.0672-104.8064z m-487.2704 411.8528a296.96 296.96 0 0 1-296.704-296.96V371.712H725.504v134.5536a296.96 296.96 0 0 1-296.6528 296.704z m458.0864-311.1936c-3.7376 46.08-26.8288 148.1216-153.6 182.4256a345.4976 345.4976 0 0 0 43.3152-167.936V419.84h76.8c13.9264 0 20.8896 1.6384 24.832 5.888s12.5952 18.9952 8.6528 66.048z"
                  fill="#1296db" p-id="6968"></path>
              <path
                  d="M503.1424 710.656a25.6 25.6 0 0 1-5.632-50.5856c114.5856-25.6 122.88-135.2704 122.88-139.9296a25.6 25.6 0 0 1 51.2 2.9184c-2.9184 52.6336-40.6528 159.488-162.9696 186.9824a26.7264 26.7264 0 0 1-5.4784 0.6144zM269.056 314.3168a25.6 25.6 0 0 1-23.04-14.336c-26.1632-53.6064 7.7824-87.04 28.0576-107.1616C282.7776 184.32 291.84 175.2576 293.0688 168.96c2.9696-15.36-21.8112-37.2224-33.536-44.8A25.6 25.6 0 0 1 286.72 80.7936c6.912 4.352 66.56 43.9808 56.32 97.7408-4.2496 22.016-19.6608 37.2736-33.3312 50.7392-22.3232 22.0672-27.0336 29.696-17.9712 48.2304a25.6 25.6 0 0 1-11.776 34.2528 25.9584 25.9584 0 0 1-10.9056 2.56zM419.84 314.3168a25.6 25.6 0 0 1-23.04-14.336c-26.1632-53.6064 7.7824-87.04 28.0064-107.1616 8.9088-8.4992 17.9712-17.5616 19.2-23.8592 2.9696-15.36-21.8112-37.2224-33.536-44.8a25.6 25.6 0 0 1 27.392-43.2128c6.8608 4.352 66.56 43.9808 56.32 97.7408-4.2496 22.016-19.712 37.2736-33.3312 50.7392-22.3232 22.0672-27.0336 29.696-17.9712 48.2304a25.6 25.6 0 0 1-11.776 34.2528 25.9584 25.9584 0 0 1-11.264 2.4064zM570.88 314.3168a25.6 25.6 0 0 1-22.9888-14.336c-26.1632-53.6064 7.7312-87.04 28.0064-107.1616C584.6528 184.32 593.92 175.2576 594.944 168.96c2.9696-15.36-21.8112-37.2224-33.5872-44.8a25.6 25.6 0 0 1 27.4432-43.3664c6.8608 4.352 66.56 43.9808 56.32 97.7408-4.2496 22.016-19.712 37.2736-33.3312 50.7392-22.3744 22.0672-27.0336 29.696-18.0224 48.2304a25.6 25.6 0 0 1-22.9888 36.8128zM742.4 921.9584H135.4752a25.6 25.6 0 0 1 0-51.2H742.4a25.6 25.6 0 1 1 0 51.2z"
                  fill="#1296db" p-id="6969"></path>
            </svg>
            <span class="text">下午号源</span>
          </div>
          <!--每一个医生的信息-->
          <div class="doc_info">
            <!--展示医生的名字|技能-->
            <div class="left">
              <div class="info">
                <span>{{doctor.title}}</span>
                <span>|</span>
                <span>{{doctor.docname}}</span>
              </div>
              <div class="skill">
                {{doctor.skill}}
              </div>
            </div>
            <!--挂号的钱数-->
            <div class="right">
              <div class="money">¥{{doctor.amount}}</div>
              <el-button type="primary" @click="goStep2(doctor)">剩余{{doctor.availableNumber}}</el-button>
            </div>
          </div>
          <div class="doc_info">
            <!--展示医生的名字|技能-->
            <div class="left">
              <div class="info">
                <span>副主任医师</span>
                <span>|</span>
                <span>xxx</span>
              </div>
              <div class="skill">
                xxxxx
              </div>
            </div>
            <!--挂号的钱数-->
            <div class="right">
              <div class="money">¥100</div>
              <el-button type="primary">100</el-button>
            </div>
          </div>
          <div class="doc_info">
            <!--展示医生的名字|技能-->
            <div class="left">
              <div class="info">
                <span>副主任医师</span>
                <span>|</span>
                <span>xxx</span>
              </div>
              <div class="skill">
                xxxxx
              </div>
            </div>
            <!--挂号的钱数-->
            <div class="right">
              <div class="money">¥100</div>
              <el-button type="primary">100</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  .top {
    display: flex;
    color: #7f7f7f;
    align-items: center;

    .line {
      width: 1px;
      height: 20px;
      background: #7f7f7f;
      margin: 0 5px;
    }

    .dot {
      margin: 0 5px;
    }
  }

  .center {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      font-weight: 900;
    }

    .container {
      width: 100%;
      margin: 30px 0;
      display: flex;

      .item {
        flex: 1;
        border: 1px solid skyblue;
        margin: 0 5px;
        width: 100%;
        transition: all 0.5s ease-in-out;
        &.active {
          border: 1px solid #ccc;
          color: #ccc;

          .top1 {
            background: #ccc;
            color: #7f7f7f;
          }
        }
        &.cur{
          transform: scale(1.1);
        }

        .top1 {
          background: #e8f2ff;
          height: 30px;
          width: 100%;
          line-height: 30px;
          text-align: center;
        }

        .bottom {
          width: 100%;
          height: 60px;
          line-height: 60px;
          text-align: center;
        }
      }
    }
  }

  .bottom {
    .will {
      text-align: center;
      font-size: 20px;
      font-weight: 900;

      .time {
        color: #55a6fe;
      }
    }

    .doctor {
      .moring {
        margin: 30px 0;

        .tip {
          display: flex;
          align-items: center;

          .text {
            color: #7f7f7f;
            font-weight: 900;
          }
        }

        .doc_info {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          border-bottom: 1px solid #ccc;

          .left {
            .info {
              color: #55a6fe;

              span {
                margin: 0 5px;
                font-weight: 900;
                font-size: 18px;
              }
            }

            .skill {
              margin: 10px 0;
              color: #7f7f7f;
            }
          }

          .right {
            width: 150px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .money {
              color: #7f7f7f;
              font-weight: 900;
            }
          }
        }
      }
    }
  }
}

</style>