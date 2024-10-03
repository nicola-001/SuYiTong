<script setup lang="ts">
import {useRoute} from "vue-router";
import {SET_TOKEN} from "@/utils/user";

defineOptions({
  name: 'wxlogin'
})
// 获取用户信息
let $route = useRoute()

// 持久化存储用户信息
SET_TOKEN(JSON.stringify($route.query))
// 授权成功
let html: any = document.querySelector('html')
html.style.display = 'none'
</script>

<template>

</template>

<style scoped lang="scss">

</style>