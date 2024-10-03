import request from "@/utils/request";
import type {
    DepartmentResponseData, DoctorInfoData, DoctorResponseData,
    HospitalDetailResponse, HospitalWorkData,
    loginData,
    UserLoginResopnseData, UserResponseData, WxLoginResponseData
} from "@/api/hospital/type";

enum API {
    // 获取医院详情的请求接口
    HOSPITALDETAIL_URL = '/hosp/hospital/',
//     获取某一个医院的科室的数据
    HOSPITALDEPARTMENT_URL = '/hosp/hospital/department/',
//     获取验证码
    GETUSERCODE = '/sms/send/',
//     用户登录接口
    USERLOGIN = '/user/login',
//     获取微信扫码登录接口需要的参数
    WEIXINLOGIN = '/user/weixin/getLoginParam/',
//     获取某个医院某个科室的挂号数据
    HOSPITALWORK_URL = '/hosp/hospital/auth/getBookingScheduleRule/',
//     获取医院某个科室某天相应医生排班的数据
    HOSPITALDOCTOR_URL = '/hosp/hospital/auth/findScheduleList/',
//     获取某个账号下就诊人信息
    GETUSER_URL='/user/patient/auth/findAll',
//     获取挂号医生的信息
    GETDOCTOR_URL='/hosp/hospital/getSchedule/',
}

//获取医院详情
export const reqHospitalDetail = (hoscode: string) => request.get<any, HospitalDetailResponse>(API.HOSPITALDETAIL_URL + hoscode)
//获取某一个医院的科室
export const reqHospitalDepartment = (hascode: string) => request.get<any, DepartmentResponseData>(API.HOSPITALDEPARTMENT_URL + hascode)
//获取验证码
export const reqUserCode = (phone: string) => request.get(API.GETUSERCODE + phone)
//用户登录接口
export const reqUserLogin = (data: loginData) => request.post<any, UserLoginResopnseData>(API.USERLOGIN, data)
//获取微信扫码登录生成二维码需要的参数接口
export const reqWxLogin = (wxRedirectUri: string) => request.get<any, WxLoginResponseData>(API.WEIXINLOGIN + `?wxRedirectUri=${wxRedirectUri}`)
//获取预约挂号的数据
export const reqHospitalWork = (page: number, limit: number, hoscode: string, depcode: string) => request.get<any, HospitalWorkData>(API.HOSPITALWORK_URL + `${page}/${limit}/${hoscode}/${depcode}`)
//获取医院某个科室某天相应医生排班的数据
export const reqHospitalDoctor = (hoscode: string, depcode: string, workDate: string) => request.get<any,DoctorResponseData>(API.HOSPITALDOCTOR_URL + `${hoscode}/${depcode}/${workDate}`)
//获取某个账号下就诊人信息
export const reqGetUser=()=>request.get<any,UserResponseData>(API.GETUSER_URL)
//获取挂号医生的信息
export const reqDoctorInfo=(scheduleId:string)=>request.get<any,DoctorInfoData>(API.GETDOCTOR_URL+scheduleId)