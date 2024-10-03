// 定义模块的数据类型
export interface ResponsData {
    code: number
    message: string,
    ok: boolean
}

//提交订单接口返回的数据的ts类型
export interface SubmitOrder extends ResponsData {
    data: number
}

//订单详情数据的ts类型
export interface OrderInfo {
    id: number,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {
        orderStatusString: string
    },
    userId: number | string,
    outTradeNo: string,
    hoscode: string,
    hosname: string,
    depcode: string,
    depname: string,
    scheduleId: string,
    title: string,
    reserveDate: string,
    reserveTime: number,
    patientId: number | string,
    patientName: string,
    patientPhone: string,
    hosRecordId: string,
    number: number,
    fetchTime: string,
    fetchAddress: string,
    amount: number,
    quitTime: string,
    orderStatus: number
}

// 订单接口返回的数据类型
export interface OrderResponseData extends ResponsData {
    data: OrderInfo
}

// 获取二维码返回的数据类型
export interface PayInfo {
    codeUrl: string,
    orderId: number,
    totalFee: number,
    resultCode: string
}

export interface QRcode extends ResponsData {
    data: PayInfo
}

// 查询支付结果
export interface PayResult extends ResponsData {
    data: boolean
}

// 用户认证携带的参数的数据类型
export interface UserParams {
    certificatesNo: string,
    certificatesType: string,
    certificatesUrl: string,
    name: string
}

// 一个订单的数据的ts类型
export interface Order {
    id: number,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {
        orderStatusString: string
    },
    userId: number,
    outTradeNo: string,
    hoscode: string,
    hosname: string,
    depcode: string,
    depname: string,
    scheduleId: null,
    title: string,
    reserveDate: string,
    reserveTime: number,
    patientId: number,
    patientName: string,
    patientPhone: string,
    hosRecordId: string,
    number: number,
    fetchTime: string,
    fetchAddress: string,
    amount: number,
    quitTime: string,
    orderStatus: number
}

export type Records = Order[]

// 获取订单接口数据的ts类型
export interface UserOrderInfoResponseData extends ResponsData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        orders: [],
        hitCount: boolean,
        searchCount: boolean,
        pages: number
    }
}
// 新增与修改已有的就诊人参数的ts类型
export interface AddOrUpdateData{
    id?: string,
    name:string,
    certificatesType: string,
    contactsCertificatesNo: string,
    sex: number,
    birthdate: string,
    phone: string,
    isMarry:number,
    isInsure: number,
    addressSelected:string[],
    address: string,
    contactsName: string,
    contactsCertificatesType: string,
    certificatesNo: string,
    contactsPhone: string,
}


