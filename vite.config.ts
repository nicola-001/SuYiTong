import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    // 给src配置别名
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
//     配置代理跨域
    server: {
        proxy: {
            '/api': {
                target: 'http://syt.atguigu.cn',
                changeOrigin: true,
            },
        }
    }
})
