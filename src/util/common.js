/**
 * Created by BinYiChen on 2018/1/31.
 */
import axios from 'axios';
const url = 'http://localhost:8080/common';

//设置全局默认请求头
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

Date.prototype.Format = function (fmt) { //author: meizz
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


/**
 *  设置cookie
 * @param cname
 * @param cvalue
 * @param minutes
 */
export const setCookie = (cname, cvalue, minutes) => {
    var d = new Date();
    d.setTime(d.getTime() + (minutes * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

/**
 * 获取cookies
 * @param name
 * @returns {null}
 */
export const getCookie = (name) => {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

/**
 * 删除cookies
 * @param name
 */
export const delCookie = (name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

/**
 * 统一请求格式（适应路由）
 * @param funcName
 * @param controllerName
 * @param data
 * @param serialNumber
 * @returns {AxiosPromise<T>}
 */
export const axiosPost = (funcName, controllerName, data, serialNumber) => {
    let postData = JSON.stringify({
        "funcName": funcName,                       //controller 中的方法名
        "controllerName": controllerName,
        "serialNumber": serialNumber,                    //请求流水
        "userAccount": getCookie("account"),                    //用户账户
        "reqSysCode": "A02",                       //请求生成端 A01-web ,A02-app, A03-微信
        "reqTime": new Date().Format("yyyy-MM-dd hh:mm:ss.S"),                      //请求时间
        "data": data,
        "security": {                                //安全层
            //访问令牌，如果没有这个需要先访问authController中的login来获取
            "accessTocken": getCookie("account"),
            "smsCode": getCookie("account"),
            "emailCode": getCookie("account"),
            "deviceId": getCookie("account"),
            "usbKey": getCookie("account"),
            "imageCode": getCookie("account"),
            "codeKey": getCookie("account")
        }
    });
    return axios.post(`${url}`, postData);
}

/**
 * 获取guid
 * @returns {string}
 */
export const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}