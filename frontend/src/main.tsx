/**
 * 应用入口文件
 * 配置 React Query、Ant Design 主题，挂载根组件
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.tsx'


// 创建React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000 // 5分钟缓存
    }
  }
})

// 主题配置
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
    colorBgContainer: '#ffffff'
  }
}

// 挂载根组件
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
)
