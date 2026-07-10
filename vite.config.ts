import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import Components from 'unplugin-vue-components/vite'; // 解析模板并自动注册对应的组件

/**
 * vant按需引入组件样式插件
 */
import AutoImport from 'unplugin-auto-import/vite'; // 自动导入对应的 API 以及样式
import { VantResolver } from '@vant/auto-import-resolver'; // 自动引入对应的组件样式

/**
 * amazing按需引入组件
 */
import { VueAmazingUIResolver } from 'vue-amazing-ui'


export default defineConfig({
    base: '/h5/',
    server: {
        host: '0.0.0.0',
        port: 5174,
        strictPort: true
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [VantResolver()],
        }),
        Components({
            resolvers: [
                VantResolver(),
                VueAmazingUIResolver()
            ]
        })
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                @use "@/styles/theme.scss" as *;
                @use "@/styles/mixin.scss" as *;
                `
            }
        }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
})
