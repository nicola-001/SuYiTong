<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";

defineOptions({
  name: 'User'
})
import {
  Document,
  Menu as IconMenu,
  Star,
  Memo,
  ChatLineSquare, HomeFilled
} from '@element-plus/icons-vue'
// 获取路由器对象
const $router=useRouter()
// 获取路由对象
const $route=useRoute()
const goUser=(path:string)=>{
  $router.push({path})
}
</script>

<template>
  <div class="user">
    <!-- 左侧导航展示区-->
    <div class="menu">
      <!--    菜单顶部文字-->
      <div class="top">
        <el-icon>
          <HomeFilled/>
        </el-icon>
        <span> / 医院信息</span>
      </div>
      <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
      >
        <el-menu-item index="/user/certification" @click="goUser('/user/certification')">
          <el-icon>
            <icon-menu/>
          </el-icon>
          <span>实名认证</span>
        </el-menu-item>
        <el-menu-item index="/user/order" @click="goUser('/user/order')">
          <el-icon>
            <document/>
          </el-icon>
          <span>挂号订单</span>
        </el-menu-item>
        <el-menu-item index="/user/patient" @click="goUser('/user/patient')">
          <el-icon>
            <Star/>
          </el-icon>
          <span>就诊人管理</span>
        </el-menu-item>
        <el-menu-item index="/user/profile" @click="goUser('/user/profile')">
          <el-icon>
            <Memo/>
          </el-icon>
          <span>账号信息</span>
        </el-menu-item>
        <el-menu-item index="/user/feedback" @click="goUser('/user/feedback')">
          <el-icon>
            <ChatLineSquare/>
          </el-icon>
          <span>意见反馈</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 右侧展示会员中心二级路由组件-->
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user {
  display: flex;

  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 2;
    .top {
      color: #7f7f7f;
      font-size: 12px;
    }
  }

  .content {
    flex: 8;
  }
}
</style>