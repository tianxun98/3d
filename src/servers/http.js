/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from "axios";
import router from "../router";
import { Message, Loading } from "element-ui";
let loadingOpt;
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
};
let instance = axios.create();
//请求超时时间
instance.defaults.timeout = 10000;
instance.defaults.headers.withCredentials = true;
instance.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
//请求拦截器
instance.interceptors.request.use(
  config => {
    loadingOpt = Loading.service({
      lock: true,
      background: "rgba(0, 0, 0, 0.7)"
    });
    // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = store.state.token;
    // token && (config.headers.Authorization = token);
    return config;
  },
  error => {
    loadingOpt.close();
    return Promise.reject(error);
  }
);
// 响应拦截器
instance.interceptors.response.use(
  response => {
    try{
        if (response.data.code === 200) {
            loadingOpt.close();
            // Message.success(response.data.message);
            return response.data;
        } else {
            loadingOpt.close();
            Message.error(response.data.message);
            return Promise.reject(response.data);
        }
    }catch (e) {
        loadingOpt.close();
    }

  },
  error => {
    try{
        if (error.response.status) {
            loadingOpt.close();
            switch (error.response.status) {
                case 401:
                    toLogin();
                    break;
                case 403:
                    Message.error('当前无权限，返回登录');
                    break;
                case 404:
                    Message.error('请求参数或者地址错误');
                    break;
                case 500:
                    Message.error(
                        error.response.data.message
                    );
                    break;
                default:
                    Message.error('服务错误');
                    break;
            }
        } else {
            loadingOpt.close();
            return Promise.reject(error.response);
        }
    }catch (e) {
        loadingOpt.close();
    }

  }
);
export default instance;
