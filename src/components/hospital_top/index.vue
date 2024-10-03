<script setup lang="ts">
import {useRouter} from "vue-router";

defineOptions({
  name: 'hospital_top'
})
import useUserStore from "@/stores/modules/user";
import {ArrowRight} from "@element-plus/icons-vue";
// 获取user仓库中的数据
const userStore = useUserStore();
// 创建路由组件
const $router = useRouter()
const goHome = () => {
  $router.push({path: "/home"})
}
// 控制显示与隐藏
const login = () => {
  userStore.visiable = true
}
// 退出登陆
const logout=()=>{
  userStore.logout()
  $router.push({path:'/home'})
}
const goUser=(path:string)=>{
  $router.push({path})
}
</script>

<template>
  <div class="top">
    <div class="container">
      <div class="left" @click="goHome">
        <img src="../../assets/images/logo.png" alt="">
        <p>医疗 预约挂号统一平台</p>
      </div>
      <div class="right">
        <p class="help">帮助中心</p>
        <p class="login" @click="login" v-if="!userStore.userInfo.name">登录/注册</p>
        <el-dropdown v-else>
              <span class="el-dropdown-link">
                {{ userStore.userInfo.name }}
                <el-icon><ArrowRight/></el-icon>
                <el-icon class="el-icon--right">
                  <arrow-down/>
                </el-icon>
              </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goUser('/user/certification')">实名认证</el-dropdown-item>
              <el-dropdown-item @click="goUser('/user/order')">挂号订单</el-dropdown-item>
              <el-dropdown-item @click="goUser('/user/patient')">就诊人管理</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.top {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;

  .container {
    width: 1200px;
    height: 70px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }

      p {
        font-size: 20px;
        color: #55a6fe;
      }
    }

    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #bbb;

      .help {
        margin-right: 10px;
      }
    }
  }
}
</style>