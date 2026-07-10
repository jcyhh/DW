import axios from 'axios'
import { getToken, getAddress, delToken } from '../config/storage'
import { langKey, addressKey, uploadApi, uploadFileName, timeOut, uploadTimeOut, type Api } from '../config/http'
import { getHeaderLang } from '../locale'
import { closeToast, showLoadingToast, showToast } from 'vant';
import { router, routerPush } from '@/router';
import { startPath } from '@/config';
import { useDappStore } from '@/store';

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: timeOut
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        if (config.data instanceof FormData)config.timeout = uploadTimeOut
        else config.headers['Content-Type'] = "application/json; charset=UTF-8"

        config.headers['Authorization'] = `Bearer ${getToken()}`
        if(addressKey)config.headers[addressKey] = getAddress()
        if(langKey)config.headers[langKey] = getHeaderLang()
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
    response => response.data,
    error => {
        const code = error.status
        if (code == 401) {
            // 登录失效
            logout()
            return Promise.reject(new Error(error.response.data || 'Error'))
        } else {
            if (error.response.data)showToast(error.response.data)
            return Promise.reject(new Error(error.response.data || 'Error'))
        }
    }
)

export const apiGet = (url: Api, params:any = '') => service({ url, method: 'get', params })
export const apiPost = (url: Api, data:any = {}) => service({ url, method: 'post', data })
export const apiDel = (url: Api, data:any = {}) => service({ url, method: 'delete', data })
export const apiPut = (url: Api, data:any = {}) => service({ url, method: 'put', data })

// 上传单张图片
export const apiUpload = () => {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        
        input.onchange = async (e:Event) => {
            const file = (e.target as HTMLInputElement)?.files?.[0]
            if (!file) {
                input.remove()
                reject(new Error('未选择文件'))
                return
            }
            
            const formData = new FormData()
            formData.set(uploadFileName, file, file.name)
            
            try {
                showLoadingToast({
                    overlay: true,
                    forbidClick: true,
                    duration: 0,
                    zIndex: 10000000000 
                });
                const response = await service({
                    url: uploadApi,
                    method: 'post',
                    data: formData,
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                closeToast()
                input.remove()
                resolve(response)
            } catch (error) {
                input.remove()
                closeToast()
                reject(error)
            }
        }
        
        input.click()
    })
}

// 登录失效
export function logout() {
    delToken()
    const useStore = useDappStore()
    useStore.address = ''
    const currentRoute = router.currentRoute.value
    if(currentRoute.path!==startPath)routerPush(startPath)
}