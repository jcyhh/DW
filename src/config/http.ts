export const langKey: string = 'Lang' // 请求头多语言的key, 配置为空代表不传

export const addressKey: string = 'Address' // 请求头钱包地址的key, 配置为空代表不传

export const uploadApi: string = '/api/uploads' // 上传接口

export const uploadFileName: string = 'upload' // 上传接口文件参数名

export const uploadTimeOut: number = 60000 // 上传请求超时时间，毫秒

export const timeOut: number = 10000 // 请求超时时间，毫秒

export type Api =
| '/api/auth/login'
| '/api/index'
| '/api/users/my/referrals'
| '/api/user'
| '/api/users/my'
| '/api/withdraws'
| '/api/users/my/balance_logs'
| '/api/burn_orders'
| '/api/orders'
| '/api/withdraws/fee'
| '/api/token_price'
| '/api/withdraws/withdraw_max_amount'
| '/api/ecc_orders'
| '/api/ecc_orders/index'
| '/api/transfer'
| '/api/beans/config'
| '/api/beans/exchange'
| '/api/beans/redeem'
| '/api/partner_orders/config'
| '/api/partner_orders'
| '/api/partner_orders'
