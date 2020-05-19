import axios from  "./http"
import interfaces from  "./interface"
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
const http = {
    get(url, params,otherUrl = '') {
        return axios.get(interfaces[url] + otherUrl, {
            params: params
        }).then(res => {
            return res
        }).catch(err => {
            return err
        })
    },
    post(url, params,otherUrl = '') {
        return axios.post(interfaces[url] + otherUrl, params)
            .then(res => {
                return res
            }).catch(err => {
                return err
            })
    },
    put(url, params,otherUrl = '') {
        return axios.put(interfaces[url] + otherUrl, params)
            .then(res => {
                return res
            }).catch(err => {
                return err
            })
    },
    delete(url, params,otherUrl = '') {
        return axios.delete(interfaces[url] + otherUrl, {data: params})
            .then(res => {
                return res
            }).catch(err => {
                return err
            })

    }
};
export default http
