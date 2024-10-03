// 定义仓库内部数据state的ts类型
import type {DepartmentArr, HospitalDetail, userInfo} from "@/api/hospital/type";

export interface DetailState {
    hospitalInfo: HospitalDetail
    departmentArr:DepartmentArr
}
//用户仓库相关state数据定义的ts类型
export interface UserState{
    visiable: boolean,
    code: string,
    userInfo:userInfo
}