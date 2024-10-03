// 封装axios
// 为什么二次封装axios?二次封装目的?
//1.利用axios请求，请求，响应拦截器功能
//2.请求拦截器中携带公共参数token
//3.响应拦截器，简化服务器返回的数据，处理服务器返回的错误
import axios from "axios";
import {ElMessage} from "element-plus";
import useUserStore from "@/stores/modules/user";

const request = axios.create({
    baseURL: "/api",//基础路径
    timeout: 5000,//超时时间
})

request.interceptors.request.use((config) => {
    const userStore = useUserStore()
    // 公共参数，将token传递进去
    let token = userStore.userInfo.token
    if (token) {
        config.headers.token = token
    }
    //  请求拦截器注入的配置对象配置对象的身上有一个headers，可以通过header携带公共参数
    return config;
})

request.interceptors.response.use((response) => {
//     响应拦截器成功的回调一般会简化数据
    return response.data;
}, (error) => {
    const status = error.response.status;
    switch (status) {
        case 404:
            ElMessage({
                type: 'error',
                message: '请求路径出现问题'
            })
            break;
        case 500 | 501 | 502 | 503 | 504 | 505:
            ElMessage({
                type: 'error',
                message: '服务器出现问题'
            })
            break;
    }
//     处理http网络错误
    return Promise.reject(new Error(error.message));
})
export default request;