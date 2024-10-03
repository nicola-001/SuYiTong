<script setup lang="ts">
import {Search} from "@element-plus/icons-vue";
import {ref} from "vue";
import {reqHospitalInfo} from "@/api/home/idex";
import type {HospitalInfo} from "@/api/home/type";
import {useRouter} from "vue-router";


defineOptions({
  name: 'Search'
})
// 收集搜索关键字（医院的名字）
let hosname = ref<string>('')
// 创建路由器对象
let $router = useRouter()
// 顶部组件的回调
const fetchData = async (keyword: string, cb: any) => {
  const result: HospitalInfo = await reqHospitalInfo(keyword)
  // 整理数据
  let showData = result.data.map(item => {
    return {
      value: item.hosname,//医院名字
      hoscode: item.hoscode,//医院编码
    }
  })
  // 给组件提供展示的数据
  cb(showData)
}

// 点击某一个推荐项
const goDetail = (item: any) => {
//   点击推荐项目，跳转到医院详情页
  $router.push({path: '/hospital/register',query:{hoscode:item.hoscode}})
}
</script>

<template>
  <div class="search">
    <el-autocomplete
        clearable
        placeholder="请输入医院名称"
        v-model="hosname"
        :fetch-suggestions="fetchData"
        :trigger-on-focus="false"
        @select="goDetail"
    />
    <el-button :icon="Search" type="primary">搜索</el-button>
  </div>
</template>
<!--深度选择器：css >>>   less /deep/  scss  ::deep -->
<style scoped lang="scss">
.search {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;

  ::v-deep(.el-input__wrapper) {
    margin-right: 10px;
  }
}
</style>