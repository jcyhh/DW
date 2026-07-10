/**
 * keepAlive: true —— 跳转别的页面后，本页面不销毁
 */
import menu from './menu'
import Start from '@/views/index.vue'

export default [
    {
        path:'/', // 启动
        component: Start
    },
    ...menu,
    {
        path:'/team',
        component: () => import('@/views/menu/team.vue')
    },
    {
        path:'/log',
        component: () => import('@/views/menu/log.vue')
    },
    {
        path:'/asset',
        component: () => import('@/views/menu/asset.vue')
    },
    {
        path:'/hashrate',
        component: () => import('@/views/menu/hashrate.vue')
    },
    {
        path:'/game',
        component: () => import('@/views/menu/game.vue')
    },
    {
        path:'/partner',
        component: () => import('@/views/menu/partner.vue')
    },
    {
        path:'/ref/:ref([a-zA-Z0-9]+)', // 接收邀请码，需配置在常规路由的下方
        component: Start
    }
]