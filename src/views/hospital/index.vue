<script setup lang="ts">
import {
  Document,
  Menu as IconMenu,
  InfoFilled,
  Search,
  Setting,
  HomeFilled
} from
      '@element-plus/icons-vue'
import {useRoute, useRouter} from "vue-router";
import {onMounted} from "vue";
import useDetailStore from "@/stores/modules/hospitalDetail";
// 创建路由实例
const $router=useRouter()
// 获取路由信息
let $route=useRoute()
// 引入仓库数据
const detailStore = useDetailStore()
// 左侧菜单点击事件的回调
const changeActive=(path:string)=>{
  $router.push({path,query:{hoscode:$route.query.hoscode}})
}

// 当父组件挂载时，通知仓库发请求，将数据存储到仓库中
onMounted(()=>{
  // 获取医院详情的数据
  detailStore.getHospital($route.query.hoscode as string)
//   获取某一个医院科室的数据
  detailStore.getDepartment($route.query.hoscode as string)
})
</script>

<template>
  <div class="hospital">
    <!--左侧导航区-->
    <div class="menu">
      <div class="top">
        <el-icon>
          <HomeFilled/>
        </el-icon>
        <span> / 会员中心</span>
      </div>
      <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
      >
        <el-menu-item index="/hospital/register" @click="changeActive('/hospital/register')">
          <el-icon>
            <icon-menu/>
          </el-icon>
          <span>预约挂号</span>
        </el-menu-item>
        <el-menu-item index="/hospital/detail" @click="changeActive('/hospital/detail')">
          <el-icon>
            <document/>
          </el-icon>
          <span>医院详情</span>
        </el-menu-item>
        <el-menu-item index="/hospital/notice"  @click="changeActive('/hospital/notice')">
          <el-icon>
            <setting/>
          </el-icon>
          <span>预约通知</span>
        </el-menu-item>
        <el-menu-item index="/hospital/close"  @click="changeActive('/hospital/close')">
          <el-icon>
            <InfoFilled/>
          </el-icon>
          <span>停诊信息</span>
        </el-menu-item>
        <el-menu-item index="/hospital/search"  @click="changeActive('/hospital/search')">
          <el-icon>
            <Search/>
          </el-icon>
          <span>查询/取消</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!--右侧内容展示区：路由组件展示位置-->
    <div class="content">
      <!-- 子组件展示结构-->
      <router-view/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hospital {
  display: flex;

  .menu {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: center;

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