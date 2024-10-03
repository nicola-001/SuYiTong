<script setup lang="ts">
defineOptions({
  name:'Close'
})
import useDetailStore from "@/stores/modules/hospitalDetail";

let hospitalStore = useDetailStore()
</script>

<template>
<div class="close">
<div class="info">
  <h1>{{ hospitalStore.hospitalInfo.hospital?.hosname }}停诊信息</h1>
  <el-empty description="暂无信息" />
</div>
</div>
</template>

<style scoped lang="scss">
.close{
  .info{
    h1{
      text-align: center;
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 50px;
    }
  }
}
</style>