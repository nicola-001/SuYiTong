<script setup lang="ts">
import {ref, watch} from "vue";

defineOptions({
  name: 'Countdown',
})
// 接收父组件传递过来的数据
const props = defineProps(['flag'])
// 监听父组件传递过来的数据
watch(() => props.flag, () => {
//   开启定时器
  const timmer = setInterval(() => {
    time.value -= 1
    if (time.value == 0) {
    clearInterval(timmer)
      $emit('getFlag',false)
    }
  }, 1000)
}, {
  immediate: true
})
// 倒计时
let time = ref<number>(5)
let $emit=defineEmits(['getFlag'])

</script>

<template>
  <span>获取验证码({{ time }})</span>
</template>

<style scoped lang="scss">

</style>