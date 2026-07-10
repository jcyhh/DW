import { showLoadingToast } from 'vant';
import BigNumber from 'bignumber.js';

export function showLoading() {
    showLoadingToast({
        overlay: true, // 遮罩
        forbidClick: true, // 禁止点击
        duration: 0, // 无限时长
        zIndex: 10000000000 // 层级
    });
}

function toBigNumber(value:number|string) {
    return new BigNumber(value || 0)
}

/**
 * 普通数字乘法精度计算
 * @param {Number|String} a - 第一个数字 
 * @param {Number|String} b - 第二个数字
 * @returns {Number} a * b
 */
export function computedMul(a:number|string, b:number|string) {
    return toBigNumber(a).times(toBigNumber(b)).toNumber()
}

/**
 * 普通数字除法精度计算
 * @param {Number|String} a - 第一个数字 
 * @param {Number|String} b - 第二个数字
 * @returns {Number} a / b 保留两位小数
 */
export function computedDiv(a:number|string, b:number|string) {
    return toBigNumber(a).div(toBigNumber(b)).toNumber()
}


/**
 * 普通数字加法精度计算
 * @param {Number|String} a - 第一个数字 
 * @param {Number|String} b - 第二个数字
 * @returns {Number} a + b
 */
export function computedAdd(a:number|string, b:number|string) {
    return toBigNumber(a).plus(toBigNumber(b)).toNumber()
}

/**
 * 普通数字减法精度计算
 * @param {Number|String} a - 第一个数字 
 * @param {Number|String} b - 第二个数字
 * @returns {Number} a - b
 */
export function computedSub(a:number|string, b:number|string) {
    return toBigNumber(a).minus(toBigNumber(b)).toNumber()
}

export function isIOS() {
    const ua = navigator.userAgent;
    const isIPhone = /iPhone/i.test(ua);
    const isIPad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    return isIPhone || isIPad || /iPod/i.test(ua);
}

// 格式化数字
export function initNumber(value:number | bigint){
    let text:string = ''
    if(value){
        const num = Math.floor(parseFloat(`${value}`) * 1e6) / 1e6
        let numFormat = new Intl.NumberFormat('en-US',{
            maximumFractionDigits: 6
        }).format(num)
        text = numFormat == '0'?'0.00':numFormat
    }else{
        text = '0.00'
    }
    return text
}

// 隐藏手机号中间信息
export function initPhone(value:string){
    if(!value)return '--'
    return value.slice(0, 3) + "****" + value.slice(value.length - 4)
}

// 隐藏钱包地址中间信息
export function initAddress(value:string){
    if(!value)return '--'
    return value.slice(0, 6) + '...' + value.slice(value.length - 4)
}

export function initTime(timestamp: number | string){
    if(!timestamp)return '--'
    
    let timestampNum = Number(timestamp);
    
    // 判断时间戳是秒还是毫秒
    // 如果时间戳小于等于 13 位数字，且大于 1000000000（2001年），则认为是秒
    if (timestampNum <= 9999999999999 && timestampNum > 1000000000) {
        // 时间戳是秒，转换为毫秒
        timestampNum = timestampNum * 1000;
    }
    
    const date = new Date(timestampNum); // 将时间戳转换为 Date 对象
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}