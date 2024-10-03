// 组合式api，选项式api
import {defineStore} from "pinia";
import {reqHospitalDepartment, reqHospitalDetail} from "@/api/hospital";
import type {DepartmentResponseData, HospitalDetail, HospitalDetailResponse} from "@/api/hospital/type";
import type {DetailState} from "@/stores/modules/interface";

const useDetailStore = defineStore('Detail', {
    state: (): DetailState => {
        return {
            //     医院详情的数据
            hospitalInfo: ({} as HospitalDetail),
            //     存储医院相关科室的数据
            departmentArr: []
        }
    },
    actions: {
        //     获取医院详情的方法
        async getHospital(hoscode: string) {
            const result: HospitalDetailResponse = await reqHospitalDetail(hoscode)
            if (result.code == 200) {
                this.hospitalInfo = result.data;
            }
        },
        async getDepartment(hoscode: string) {
            const result: DepartmentResponseData = await reqHospitalDepartment(hoscode)
            if (result.code == 200) {
                this.departmentArr = result.data;
            }
        }
    },
    getters: {}
})
export default useDetailStore