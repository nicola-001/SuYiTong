<script setup lang="ts">
import {Delete, Edit} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import {reqRemoveUser} from "@/api/user";
import {ElMessage} from "element-plus";

defineOptions({
  name: 'Visitor'
})

const props = defineProps(['user', 'index', 'currentIndex'])
let $route = useRoute()
let $router=useRouter()
let $emit = defineEmits(['chengeScene','removeUser'])
// 就诊人修改按钮
const handler = () => {
  // 就诊人管理模块修改按钮  预约挂号
  if($route.path === '/user/patient') {
    $emit("chengeScene", props.user)
  }else {
  //   路由跳转携带参数
    $router.push({path:'/user/patient',query:{type:'edit',id:props.user.id}})
  }

}
// 删除某个用户
const removeUser=async ()=>{
 try {
   await reqRemoveUser(props.user.id)
   ElMessage({
     type: 'success',
     message:'删除成功'
   })
   $emit('removeUser')
 }catch (e) {
   ElMessage({
     type: 'error',
     message:'删除失败'
   })
 }
}
</script>

<template>
  <div class="visitor">
    <div class="top">
      <div class="left">
        <span class="free">{{ user.isInsure == 1 ? '医保' : '自费' }}</span>
        <span class="username">{{ user.name }}</span>
      </div>
      <div class="right">
        <el-button circle type="primary" :icon="Edit" @click="handler"></el-button>
        <el-popconfirm :title="`你确定要删除${user.name}吗？`" width="200" @confirm="removeUser">
          <template #reference>
            <el-button circle type="danger" :icon="Delete" v-if="$route.path=='/user/patient'"></el-button>
          </template>
        </el-popconfirm>

      </div>
    </div>
    <div class="bottom">
      <p>证件类型:{{ user.param.certificatesTypeString }}</p>
      <p>证件号码:{{ user.certificatesNo }}</p>
      <p>用户性别:{{ user.sex == 0 ? '女' : '男' }}</p>
      <p>出生日期:{{ user.birthdate }}</p>
      <p>手机号码:{{ user.phone }}</p>
      <p>婚姻状况:{{ user.isMarry == 0 ? '未婚' : '已婚' }}</p>
      <p>当前住址：{{ user.param.cityString }}</p>
      <p>详细地址:{{ user.param.fullAddress }}</p>
      <!--    红色已选择的盒子-->
      <transition name="confirm">
        <div class="confirm" v-if="index==currentIndex">已选择</div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.visitor {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);

  .top {
    height: 60px;
    background: #e5e5e5;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .left {
      .free {
        background: #fff;
        padding: 5px;
        font-size: 12px;
        margin-right: 5px;
        border-radius: 10px;
      }

      .username {
        color: #7f7f7f;
      }
    }
  }

  .bottom {
    padding-left: 50px;
    position: relative;

    p {
      line-height: 40px;
    }

    .confirm {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      border: 1px dashed #f00;
      color: #f00;
      text-align: center;
      line-height: 200px;
      left: 20%;
      top: 20%;
      opacity: 0.5;
      transform: rotate(35deg);
      font-weight: 900;
    }

    .confirm-enter-from {
      transform: scale(1);
    }

    .confirm-enter-active {
      transition: 0.3s all;
    }

    .confirm-enter-to {
      transform: scale(1.2);
    }
  }

}
</style>