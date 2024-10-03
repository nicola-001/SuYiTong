<script setup lang="ts">
import {User, Lock} from "@element-plus/icons-vue";

defineOptions({
  name: 'Login'
})
import useUserStore from "@/stores/modules/user";
import {computed, reactive, ref, watch} from "vue";
import Countdown from "@/components/countdown/index.vue";
import {ElMessage} from "element-plus";
import {reqWxLogin} from "@/api/hospital";
import type {WxLoginResponseData} from "@/api/hospital/type";
import {useRoute, useRouter} from "vue-router";

// 获取user仓库中的数据
const userStore = useUserStore();
let scene = ref<number>(0) //0 手机号码 1微信扫码
// 点击微信扫码|微信小图标切换为微信扫码登录
// 定义响应式数据控制倒计时组件的显示与隐藏
let flag = ref<boolean>(false)
// 获取form组件实例
const form = ref()
// 收集表单数据手机号码
const loginParams = reactive({
  phone: '',
  code: ''
})
// 计算表单收集的内容是否是手机号码格式
let isPhone = computed(() => {
// 手机号码正则表达式
  const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
//   返回布尔值 真：是  假  不是手机号码
  return reg.test(loginParams.phone)
})
const $router = useRouter()
const $route = useRoute()
const chengeScene = async () => {
  // 切换场景为1 扫码登录
  scene.value = 1;
  //获取扫码需要二维码需要的参数
  // 需要携带一个参数，告诉后台服务器用户授权登录成功后重定向到某一个页面
  let redirect_URL = encodeURIComponent(window.location.origin + "/wxlogin");
  console.log(redirect_URL);
  const result: WxLoginResponseData = await reqWxLogin(redirect_URL)
  console.log(result)
//   生成微信扫码登录的二维码页面
//   @ts-ignore
  new WxLogin({
    self_redirect: true, //手机点击确认登录后可以在 iframe 内跳转到 redirect_uri
    id: "login_container",//第三方页面显示二维码的容器id
    appid: result.data.appid,//应用唯一标识appid
    scope: "snsapi_login",//授权作用域，当前扫码页面已经授权
    redirect_uri: result.data.redirectUri,//重定向地址，需要进行UrlEncode（微信服务器向后台推送code的地址）
    state: result.data.state,//后台服务器重定向地址,携带用户信息
    style: "black",//二维码外观
    href: ""//自定义二维码外观
  });
}
// 获取验证码
const getCode = async () => {
//   开启倒计时模式
  flag.value = true
//   通知仓库存储验证码
  try {
    // 获取验证码成功
    await userStore.getCode(loginParams.phone)
    loginParams.code = userStore.code

  } catch (e) {
    // 获取验证码失败

  }
}

const getFlag = (val: boolean) => {
// 倒计时为0时，倒计时组价隐藏
  flag.value = val
}
//用户登录按钮的回调
const login = async () => {
  await form.value.validate()
//   通知仓库发送登录请求
  try {
    // 用户登录成功
    await userStore.userLogin(loginParams)
    userStore.visiable = false
    let redirect = $route.query.redirect
    if (redirect) {
      $router.push(redirect as string)
    } else {
      $router.push('/home')
    }

  } catch (e) {
    ElMessage({
      type: 'error',
      message: (e as Error).message,
    })
  }
}
// 手机号码表单校验
const validatePhone = (rule: any, value: any, callback: any) => {
  const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号码'))
  }
}
// 验证码表单校验
const validateCode = (rule: any, value: any, callback: any) => {
  if (/^\d{6}$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的验证码'))
  }

}
// 表单验证规则
const rule = ({
  // 收集号码校验规则
  phone: [{trigger: 'change', validator: validatePhone}],
  code: [
    {trigger: 'blur', validator: validateCode},
  ]
})

// 关闭窗口按钮的回调
const closeDialog = () => {
  userStore.visiable = false
}
// 点击手机验证码盒子的回调
const handler = () => {
  scene.value = 0
}
// 监听场景数据
watch(
    () => scene.value,
    (val: number) => {
      if (val == 1) {
        userStore.queryState()
      }
    })
</script>

<template>
  <div class="loginContainer">
    <el-dialog v-model="userStore.visiable" title="用户登录" width="800">
      <div class="content">
        <el-row>
          <!--左侧结构：收集号码登录，微信扫一扫登录-->
          <el-col :span="12">
            <div class="login">
              <div v-show="scene==0">
                <el-form
                    :model="loginParams"
                    :rules="rule"
                    ref="form"
                >
                  <el-form-item prop="phone">
                    <el-input
                        placeholder="请输入手机号码"
                        :prefix-icon="User"
                        v-model="loginParams.phone"/>
                  </el-form-item>
                  <el-form-item prop="code">
                    <el-input
                        placeholder="请输入收集验证码"
                        :prefix-icon="Lock"
                        v-model="loginParams.code"/>
                  </el-form-item>
                  <el-form-item>
                    <el-button :disabled="!isPhone || flag ? true : false" @click="getCode">
                      <Countdown v-if="flag" :flag="flag" @getFlag="getFlag"/>
                      <span v-else @click="getCode">获取验证码</span>
                    </el-button>
                  </el-form-item>
                </el-form>
                <div class="bottom" @click="chengeScene">
                  <el-button type="primary" style="width: 100%"
                             :disabled="!isPhone||loginParams.code.length!=6"
                             @click="login">用户登录
                  </el-button>
                  <p>微信扫码登录</p>
                  <svg t="1727509262505" class="icon" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="11849" width="32" height="32">
                    <path
                        d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z"
                        fill="#4ba251" p-id="11850"></path>
                    <path
                        d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z"
                        fill="#4ba251" p-id="11851"></path>
                  </svg>
                </div>
              </div>
              <div class="webchat" v-show="scene==1">
                <!-- 在这个容器中放入二维码-->
                <div id="login_container"></div>
                <div class="phone" @click="handler">
                  <p>手机验证码登录</p>
                  <svg t="1727597931607" class="icon" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="4351" width="16" height="16">
                    <path
                        d="M512.3072 883.3024c-41.2672 0-74.8544-33.5872-74.8544-74.8544s33.5872-74.8544 74.8544-74.8544 74.8544 33.5872 74.8544 74.8544S553.5744 883.3024 512.3072 883.3024zM512.3072 770.4576c-20.992 0-37.9904 16.9984-37.9904 37.9904s16.9984 37.9904 37.9904 37.9904 37.9904-16.9984 37.9904-37.9904S533.1968 770.4576 512.3072 770.4576z"
                        fill="#d4237a" p-id="4352"></path>
                    <path
                        d="M680.1408 991.9488c-3.1744 0-6.4512-0.8192-9.4208-2.56-41.2672-24.4736-108.032-24.3712-108.7488-24.3712 0 0-0.1024 0-0.1024 0L276.8896 965.0176c-54.3744 0-98.5088-44.2368-98.5088-98.5088L178.3808 140.3904c0-54.3744 44.2368-98.5088 98.5088-98.5088l470.7328 0c54.3744 0 98.5088 44.2368 98.5088 98.5088l0 726.1184c0 54.3744-44.2368 98.5088-98.5088 98.5088-10.1376 0-18.432-8.2944-18.432-18.432s8.2944-18.432 18.432-18.432c33.9968 0 61.6448-27.648 61.6448-61.6448L809.2672 140.3904c0-33.9968-27.648-61.6448-61.6448-61.6448L276.8896 78.7456c-33.9968 0-61.6448 27.648-61.6448 61.6448l0 726.1184c0 33.9968 27.648 61.6448 61.6448 61.6448l284.8768 0c4.1984 0 78.0288-0.1024 127.7952 29.4912 8.704 5.2224 11.6736 16.4864 6.4512 25.2928C692.5312 988.7744 686.4896 991.9488 680.1408 991.9488z"
                        fill="#d4237a" p-id="4353"></path>
                    <path
                        d="M589.824 149.7088 434.7904 149.7088c-10.1376 0-18.432-8.2944-18.432-18.432s8.2944-18.432 18.432-18.432L589.824 112.8448c10.1376 0 18.432 8.2944 18.432 18.432S599.9616 149.7088 589.824 149.7088z"
                        fill="#d4237a" p-id="4354"></path>
                    <path
                        d="M705.024 230.0928c9.728 0 17.7152 7.8848 17.7152 17.7152l0 376.9344c0 9.728-7.8848 17.7152-17.7152 17.7152L319.5904 642.4576c-9.728 0-17.7152-7.8848-17.7152-17.7152L301.8752 247.808c0-9.728 7.8848-17.7152 17.7152-17.7152L705.024 230.0928M705.024 193.2288 319.5904 193.2288c-30.1056 0-54.5792 24.4736-54.5792 54.5792l0 376.9344c0 30.1056 24.4736 54.5792 54.5792 54.5792l385.4336 0c30.1056 0 54.5792-24.4736 54.5792-54.5792L759.6032 247.808C759.6032 217.7024 735.1296 193.2288 705.024 193.2288L705.024 193.2288z"
                        fill="#d4237a" p-id="4355"></path>
                  </svg>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="leftContent">
              <div class="top">
                <div class="item">
                  <img src="../../assets/images/code_app.png" alt="">
                  <svg t="1727509262505" class="icon" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="11849" width="32" height="32">
                    <path
                        d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z"
                        fill="#515151" p-id="11850"></path>
                    <path
                        d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z"
                        fill="#515151" p-id="11851"></path>
                  </svg>
                  <p>微信扫一扫关注</p>
                  <p>"快速预约挂号"</p>
                </div>
                <div class="item">
                  <img src="../../assets/images/code_login_wechat.png" alt="">
                  <svg t="1727510558376" class="icon" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="13541" width="32" height="32">
                    <path
                        d="M256 85.333333h512c64.8 0 117.333333 52.533333 117.333333 117.333334v618.666666c0 64.8-52.533333 117.333333-117.333333 117.333334H256c-64.8 0-117.333333-52.533333-117.333333-117.333334V202.666667c0-64.8 52.533333-117.333333 117.333333-117.333334z m0 64a53.333333 53.333333 0 0 0-53.333333 53.333334v618.666666a53.333333 53.333333 0 0 0 53.333333 53.333334h512a53.333333 53.333333 0 0 0 53.333333-53.333334V202.666667a53.333333 53.333333 0 0 0-53.333333-53.333334H256z m170.666667 618.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z"
                        fill="#707070" p-id="13542"></path>
                  </svg>
                  <p>扫一扫下载</p>
                  <p>"预约挂号APP"</p>
                </div>
              </div>
              <p class="tip">尚医通官方指定平台</p>
              <p class="tip">快速挂号 安全放心</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button type="primary" @click="closeDialog">关闭窗口</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.loginContainer {
  ::v-deep(.el-dialog__body) {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  .content {
    padding: 50px;

    .login {
      padding: 20px;
      border: 1px solid #ccc;

      .webchat {
        display: flex;
        flex-direction: column;
        align-items: center;

        .phone {
          display: flex;
          flex-direction: column;
          align-items: center;

          p {
            margin: 10px 0;
          }
        }
      }
    }

    .bottom {
      display: flex;
      flex-direction: column;
      align-items: center;

      p {
        margin: 10px 0;
      }
    }

    .leftContent {
      .top {
        display: flex;
        justify-content: space-around;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;

          img {
            width: 130px;
            height: 130px;
          }

          p {
            margin: 5px 0;
          }
        }
      }
    }

    .tip {
      text-align: center;
      margin: 15px 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>