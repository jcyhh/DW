import Layout from '@/layout/index.vue'

export default [
    {
        path:'/home',
        component: Layout,
        redirect: '/home/index',
        meta:{
            title:'首页'
        },
        children:[{
            path:'index',
            component: () => import('@/views/menu/home.vue')
        }]
    }
]