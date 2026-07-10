import { createRouter, createWebHistory } from 'vue-router'
import routes from "./modules";
import { publicPath } from '@/config'

export const router = createRouter({
    history: createWebHistory(publicPath),
    routes,
    scrollBehavior(){
        return { top: 0 }
    }
})

// 跳转
export const routerPush = (path:string, query:any = null) => {
    let obj = { path }
    if(query)obj = {...obj,...{query}}
    router.push(obj)
}

// 替换
export const routerReplace = (path:string, query:any = null) => {
    let obj = { path }
    if(query)obj = {...obj,...{query}}
    router.replace(obj)
}

// 默认返回
export const routerGo = (count:number = -1) => router.go(count)