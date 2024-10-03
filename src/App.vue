<script setup lang="ts">
import useUserStore from "@/stores/modules/user";

const userStore = useUserStore();
</script>

<template>
<div class="container">
<!--  顶部全局组件-->
    <HospitalTop/>
<!--  路由组件-->
  <div class="content">
    <router-view/>
  </div>
<!--  底部全局路由组件-->
  <HospitalBottom/>
<!--  登录组件-->
  <Login v-if="userStore.visiable"/>
</div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .content{
    width: 1200px;
    margin-top: 70px;
    min-height: 700px;
    justify-content: center;
  }
}
</style>
