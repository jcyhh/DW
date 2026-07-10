import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

/**
 * 大数字计算配置
 */
import BigNumber from 'bignumber.js';
BigNumber.set({
    ROUNDING_MODE: BigNumber.ROUND_DOWN, // 直接裁剪，非四舍五入
    DECIMAL_PLACES: 6 // 默认六位小数
});

/**
 * VantUI
 */
import '@vant/touch-emulator'; // 电脑端mouse事件转touch事件
import 'vant/es/toast/style';
import 'vant/es/image-preview/style';

/**
 * 公共样式
 */
import '@/styles/color.scss';
import '@/styles/index.scss';
import '@/styles/base.scss';
import '@/styles/ui.scss'; // 直接覆盖UI组件的样式

/**
 * 动画库
 */
import 'animate.css';

/**
 * 指令
 */
import { copy, delay, scale, filter, onShow } from '@/directives';
app.directive('scale', scale);
app.directive('copy', copy);
app.directive('delay', delay);
app.directive('init', filter);
app.directive('on-show', onShow);

/**
 * 多语言
 */
import { i18n } from '@/locale'
app.use(i18n)

/**
 * pinia
 */
import { setupStore } from '@/store'
setupStore(app)

/**
 * vue-router
 */
import { router } from '@/router'
app.use(router)

/**
 * 正式环境禁用console
 */
// if(import.meta.env.PROD){
//     console.log = ()=>{}
//     console.warn = ()=>{}
//     console.error = ()=>{}
//     console.debug = ()=>{}
// }

/**
 * 启用VConsole
 */
// import VConsole from 'vconsole'
// new VConsole()

app.mount('#app')
