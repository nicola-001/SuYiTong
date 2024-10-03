<script setup lang="ts">
import {onMounted, ref} from "vue";
import {reqHospitalLevelAndRegion} from "@/api/home/idex";
import type {HospitalLevelAndReigonArr, HospitalLevelAndReigonResponseData} from "@/api/home/type";

defineOptions({
  name: 'Region'
})
// 存储地区数据
let regionArr = ref<HospitalLevelAndReigonArr>([])
// 获取地区数据
const getRegion = async () => {
  const result: HospitalLevelAndReigonResponseData = await reqHospitalLevelAndRegion('Beijin')
  if (result.code == 200) {
    regionArr.value = result.data
  }
}
// 地区高亮的效果
let RegionFlag = ref<string>('')
onMounted(() => {
  getRegion()
})
// 点击不同按钮的回调
const chengeReigion = (reigion: string) => {
  RegionFlag.value = reigion
  $emit('getRegion', reigion)
}
// 接收父组件传递过来
const $emit = defineEmits(['getRegion'])
</script>

<template>
  <div class="region">
    <div class="content">
      <div class="left">
        地区：
      </div>
      <ul>
        <li :class="{active:RegionFlag==''}" @click="chengeReigion('')">全部</li>
        <li v-for="reigion in regionArr" :key="reigion.value" :class="{active:RegionFlag==reigion.value}"
            @click="chengeReigion(reigion.value)">{{ reigion.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.region {
  color: #7f7f7f;
  margin-top: 10px;

  .content {
    display: flex;

    .left {
      margin-right: 10px;
      width: 60px;
    }

    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        margin-right: 10px;
        margin-bottom: 10px;

        &.active {
          color: #55a6fe;
        }
      }

      li:hover {
        color: #55a6fe;
        cursor: pointer;
      }
    }
  }
}
</style>