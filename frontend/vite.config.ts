import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  build: {
    outDir: 'build',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        entryFileNames: 'static/js/[name].[hash].js',
        chunkFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
        manualChunks: (id) => {
          // 自动获取第三方库名称
          if (id.includes('node_modules')) {
            const modulePath = id.split('node_modules/')[1]
            const moduleName = modulePath.split('/')[0]

            // 自动分类大型库
            if (moduleName.includes('react')) return 'vendor-react'
            if (moduleName.includes('antd') || moduleName.includes('ant-design')) return 'vendor-antd'
            if (moduleName.includes('chart') || moduleName.includes('echarts')) return 'vendor-charts'
            if (moduleName.includes('xlsx') || moduleName.includes('file')) return 'vendor-files'
            if (moduleName.includes('axios') || moduleName.includes('query') || moduleName.includes('request')) return 'vendor-http'
            if (moduleName.includes('icon') || moduleName.includes('svg')) return 'vendor-icons'
            // 只有当实际存在日期库时才分包
            if (moduleName.includes('date') || moduleName.includes('moment') || moduleName.includes('dayjs')) return 'vendor-date'

            // 避免单字母库名导致的问题
            if (moduleName.length === 1) return 'vendor-single'
            
            // 其他第三方库按首字母分组
            const firstChar = moduleName.charAt(0).toLowerCase()
            return `vendor-${firstChar}`
          }

          // 自动获取组件目录结构
          if (id.includes('src/components/')) {
            const componentPath = id.split('src/components/')[1]
            const componentDir = componentPath.split('/')[0]
            return `comp-${componentDir}`
          }

          // 自动获取页面目录结构
          if (id.includes('src/pages/')) {
            const pagePath = id.split('src/pages/')[1]
            const pageDir = pagePath.split('/')[0]
            return `page-${pageDir}`
          }

          // 自动获取其他src目录结构
          if (id.includes('src/')) {
            const srcPath = id.split('src/')[1]
            const srcDir = srcPath.split('/')[0]

            // 根据目录名自动分类
            if (srcDir === 'utils' || srcDir === 'helpers' || srcDir === 'lib') return 'core-utils'
            if (srcDir === 'hooks' || srcDir === 'composables') return 'core-hooks'
            if (srcDir === 'services' || srcDir === 'api') return 'core-services'
            if (srcDir === 'store' || srcDir === 'state' || srcDir === 'context') return 'core-state'
            if (srcDir === 'types' || srcDir === 'interfaces' || srcDir === 'models') return 'core-types'
            if (srcDir === 'assets' || srcDir === 'images' || srcDir === 'styles') return 'assets'

            return `module-${srcDir}`
          }
        }
      },
    },
  }
})
