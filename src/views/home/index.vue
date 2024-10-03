<script setup lang="ts">
import Search from "@/views/home/Search/index.vue";

defineOptions({
  name: 'Home'
})
import Carousel from "@/views/home/Carousel/index.vue";
import Level from "@/views/home/level/index.vue";
import Region from "@/views/home/region/index.vue";
import Card from "@/views/home/card/index.vue";
import {onMounted, ref} from "vue";
import {reqHospital} from "@/api/home/idex";
import type {Content, HospitalResponseData} from "@/api/home/type";
import Tip from "@/views/home/tip/index.vue";

// 分页器页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(10)
// 分页器数据总条数
let total = ref<number>(0)
// 存储等级的响应式数据
let hostype = ref<string>('')
// 存储医院地区
let districtCode = ref<string>('')

// 存储已有的医院的数据
let hasHospitalArr: any = ref([])

const getHospitalInfo = async () => {
  const result: HospitalResponseData = await reqHospital(pageNo.value, pageSize.value, hostype.value, districtCode.value)
  if (result.code == 200) {
    // 存储数据
    hasHospitalArr = result.data.content
    // 存储总条数
    total.value = result.data.totalElements
  }
}
// 组件挂在完毕，发请求
onMounted(() => {
  getHospitalInfo()
})
// 分页器页码发生变化时发生的回调
const currentChange = () => {
  getHospitalInfo()
}
// 分页器下拉菜单发生变化的时候触发
const sizeChange = () => {
  getHospitalInfo()
}
// 获取子组件传递的等级数据
const getLevel = (level: string) => {
//   收集等级参数
  hostype.value = level
//   重新发送请求
  getHospitalInfo()
}
// 获取子组件传递过来的地区的数据
const getRegion = (region: string) => {
  districtCode.value = region
  getHospitalInfo()
}
</script>

<template>
  <div>
    <!--首页轮播图的效果-->
    <Carousel/>
    <!--搜索医院表单区域-->
    <Search/>
    <!--底部展示医院的结构-->
    <el-row :gutter="20">
      <el-col :span="20">
        <!--等级子组件-->
        <Level @getLevel="getLevel"/>
        <!--地区子组件-->
        <Region @getRegion="getRegion"/>
        <!-- 展示医院结构-->
        <div class="hospital" v-if="hasHospitalArr.length>0">
          <Card class="item" v-for="item in hasHospitalArr" :key="item.id" :hospitalInfo="item"/>
        </div>
        <el-empty v-else description="暂无数据"/>
        <!-- 分页器-->
        <div class="pagination">
          <el-pagination
              v-model:current-page="pageNo"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 30, 40]"
              :background="true"
              layout=" prev, pager, next, jumper,->, sizes,total"
              :total="total"
              @current-change="currentChange"
              @size-change="sizeChange"
          />
        </div>
      </el-col>
      <el-col :span="4">
        <Tip/>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.hospital {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .item {
    width: 48%;
    margin: 10px 0;
  }
}

.pagination {
  margin: 20px 0;
}
</style>