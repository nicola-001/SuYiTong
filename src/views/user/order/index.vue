<script setup lang="ts">
import {useRoute} from "vue-router";
import AllOrder from "@/views/user/order/allOrder/index.vue";
import Detail from "@/views/user/order/detail/index.vue";

defineOptions({
  name: 'Order'
})
const $route = useRoute()
</script>

<template>
  <div class="order">
    <!--订单详情 -->
    <div v-if="$route.query.orderId">
     <Detail/>
    </div>
    <!--所有订单-->
    <div v-else>
      <AllOrder/>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>