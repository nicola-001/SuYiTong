// 定义模块的数据类型
export interface ResponsData {
    code: number
    message: string,
    ok: boolean
}

//医院详情的数据
export interface HospitalDetail {
    bookingRule: {
        cycle: number,
        releaseTime: string,
        stopTime: string,
        quitDay: number,
        quitTime: string,
        rule: string[]
    },
    hospital: {
        id: string,
        createTime: string,
        updateTime: string,
        isDeleted: number,
        param: {
            hostypeString: string,
            fullAddress: string
        },
        hoscode: string,
        hosname: string,
        hostype: string,
        provinceCode: string,
        cityCode: string,
        districtCode: string,
        address: string,
        logoData: string,
        intro: null,
        route: string,
        status: number,
        bookingRule: null
    }
}

//医院详情返回数据类型
export interface HospitalDetailResponse extends ResponsData {
    data: HospitalDetail
}

//定义科室的数据类型
export interface Department {
    depcode: string,
    depname: string,
    children?: Department[]
}

//代表存储科室的数组类型
export type DepartmentArr = Department[]

//获取科室接口返回的数据类型
export interface DepartmentResponseData extends ResponsData {
    data: DepartmentArr
}

//用户登录接口
export interface loginData {
    phone: string,
    code: string,
}

//登录接口返回用户信息数据
export interface userInfo {
    name: string,
    token: string,
}

//登录接口返回的数据的类型
export interface UserLoginResopnseData extends ResponsData {
    data: userInfo
}

//定义微信扫码返回的数据类型
export interface WxLogin {
    redirectUri: string,
    appid: string,
    scope: string,
    state: string
}

export interface WxLoginResponseData extends ResponsData {
    data: WxLogin
}

export interface BaseMap {
    workDateString: string,
    releaseTime: string,
    bigname: string,
    stopTime: string,
    depname: string,
    hosname: string
}

export interface workDate {
    workDate: string,
    workDateMd: string,
    dayOfWeek: string,
    docCount: number,
    reservedNumber: number | null,
    availableNumber: number,
    status: number
}

export type BookingScheduleList = workDate[]

export interface HospitalWorkData extends ResponsData {
    data: {
        total: number,
        bookingScheduleList: BookingScheduleList,
        baseMap: BaseMap
    }
}

//一个医生的数据
export interface Doctor {
    id: string,
    createTime: string,
    updateTime: string,
    isDeleted: string,
    param: {
        dayOfWeek: string,
        depname: string,
        hosname: string
    },
    hoscode: string,
    depcode: string,
    title: string,
    docname: string,
    skill: string,
    workDate: string,
    workTime: number,
    reservedNumber: number,
    availableNumber: number,
    amount: number,
    status: number,
    hosScheduleId: string
}

//数组包含全部医生
export type DocArr = Doctor[]

export interface DoctorResponseData extends ResponsData {
    data: DocArr
}
//一个就诊人的数据类型
export interface User{
    id: number,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param:{
        certificatesTypeString:string,
        contactsCertificatesTypeString:string,
        cityString:null,
        fullAddress:string,
        districtCode:string,
        provinceString:string,
    },
    userId:number,
    name:string|number,
    certificatesType:string,
    certificatesNo:string,
    sex:number,
    birthday:string,
    phone:string,
    isMarry:number,
    provinceCode:null,
    cityCode:null,
    districtCode:null,
    address:string,
    contactsName:string,
    contactsCertificatesType:string,
    contactsCertificatesNo:string,
    contactsPhone:string,
    isInsure:number,
    cardNo:null,
    status:string,
}

export type UserArr=User[]

export interface UserResponseData extends ResponsData {
    data: UserArr
}
//获取某一个挂号医生的数据详情
export interface DoctorInfoData extends ResponsData {
    data: Doctor
}