// 统一管理首页模块接口
import request from "@/utils/request";
import type {HospitalInfo, HospitalLevelAndReigonResponseData, HospitalResponseData} from "@/api/home/type";

//通过枚举管理首页模块接口
enum API {
//     获取已有的医院数据接口
    HOSPITAL_URL = '/hosp/hospital/',
//     获取医院等级与地区的接口
    HOSPITALLEVELANDOREGION_URL = '/cmn/dict/findByDictCode/',
//     根据医院关键字获取医院接口
    HOSPITALINFO_URL = '/hosp/hospital/findByHosname/',
}

//获取医院的数据
export const reqHospital = (page: number, limit: number, hostype = '', districtCode = '') => request.get<any, HospitalResponseData>(API.HOSPITAL_URL + `${page}/${limit}?hostype=${hostype}&districtCode=${districtCode}`,)
//     获取医院等级与地区的接口
export const reqHospitalLevelAndRegion = (dictCode: string) => request.get<any, HospitalLevelAndReigonResponseData>(API.HOSPITALLEVELANDOREGION_URL + dictCode)
//  根据医院关键字获取医院数据
export const reqHospitalInfo = (hosname: string) => request.get<any,HospitalInfo>(API.HOSPITALINFO_URL + hosname)
