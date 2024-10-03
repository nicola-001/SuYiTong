<script setup lang="ts">
import {onMounted, ref} from "vue";
import {reqHospitalLevelAndRegion} from "@/api/home/idex";
import type {HospitalLevelAndReigonArr, HospitalLevelAndReigonResponseData} from "@/api/home/type";

defineOptions({
  name: 'level'
})
// 存储医院等级数据
let levelArr = ref<HospitalLevelAndReigonArr>([])
// 控制医院等级高亮效果
let activeFlag = ref<string>('')
// 获取等级或地区的数据
const getLevel = async () => {
  const result: HospitalLevelAndReigonResponseData = await reqHospitalLevelAndRegion('HosType')
  if (result.code == 200) {
    levelArr.value = result.data
  }
}
onMounted(() => {
  getLevel()
})
// 高亮效果
const chengeLevel = (level: string) => {
  // 存储level的数据
  activeFlag.value = level
//   触发自定义事件，将医院等级参数传递给父组件
  $emit('getLevel', level)
}
let $emit = defineEmits(['getLevel'])

</script>

<template>
  <div class="level">
    <h1>医院</h1>
    <div class="content">
      <div class="left">等级：</div>
      <ul class="hospital">
        <li :class="{active:activeFlag==''}" @click="chengeLevel('')">全部</li>
        <li v-for="level in levelArr" :key="level.value" :class="{active:activeFlag==level.value}"
            @click="chengeLevel(level.value)">{{ level.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.level {
  color: #7f7f7f;

  h1 {
    font-weight: 900;
    margin: 10px 0;
  }

  .content {
    display: flex;

    .left {
      margin-right: 10px;
      width: 60px;
    }

    .hospital {
      display: flex;

      li {
        margin-right: 10px;

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