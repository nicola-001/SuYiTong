// 定义用户相关的仓库
import {defineStore} from "pinia";
import {reqUserCode, reqUserLogin} from "@/api/hospital";
import type {loginData, UserLoginResopnseData} from "@/api/hospital/type";
import type {UserState} from "@/stores/modules/interface";
import {GET_TOKEN, REMOVE_TOKEN, SET_TOKEN} from "@/utils/user";

const useUserStore = defineStore('User', {
    state: (): UserState => {
        return {
            //     控制登录组件中dialog的显示与隐藏
            visiable: false,
            code: '',
            userInfo: JSON.parse(GET_TOKEN() as string) || {}
        }
    },
    actions: {
        async getCode(phone: string) {
            const result: any = await reqUserCode(phone)
            if (result.code == 200) {
                this.code = result.data
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        async userLogin(loginData: loginData) {
            const result: UserLoginResopnseData = await reqUserLogin(loginData)
            if (result.code == 200) {
                this.userInfo = result.data
                SET_TOKEN(JSON.stringify(this.userInfo))
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }
        },
        logout() {
            this.userInfo = {name: '', token: ''};
            REMOVE_TOKEN()
        },
        //     查询微信扫码的接口（看本地存储时候存储数据）
        queryState() {
            //     开始定时器，每个一段时间问本地是否拥有用户信息
            let timmer = setInterval(() => {
                //     本地存储已经有数据：扫码成功
                if (GET_TOKEN()) {
                    //     关闭对话框
                    this.visiable = false
                    // 存储用户信息
                    this.userInfo=JSON.parse(GET_TOKEN() as string)
                    clearInterval(timmer)
                }
            }, 1000)
        }
    },
    getters: {}
})
export default useUserStore
