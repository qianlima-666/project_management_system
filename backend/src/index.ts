/**
 * 应用程序入口文件
 * 启动后端服务，初始化数据库、Redis、端口检查等
 */
import { serve } from '@hono/node-server'
import { createApp } from './app'
import { config } from './config'
import { DatabaseConnection } from './database/connection'
import { DatabaseMigration } from './database/migration'
import { redisClient } from './lib/redis'
import { isPortInUse } from './utils/port.util'

console.log('🚀 项目管理系统后端服务启动中...')
console.log(`🌐 前端域名: ${config.cors.origin.join(', ')}`)

const app = createApp()

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('🔄 正在关闭服务...')
  await Promise.all([
    redisClient.quit(),
    DatabaseConnection.disconnect()
  ])
  process.exit()
})

// 启动服务
async function startServer() {
  try {
    // 检查端口
    if (await isPortInUse(config.port)) {
      console.log(`❌ 端口 ${config.port} 已被占用，请更换端口号`)
      process.exit(1)
    }

    // 连接数据库
    const dbConnected = await DatabaseConnection.connect()
    if (!dbConnected) {
      console.log('❌ 数据库连接失败，服务无法启动')
      process.exit(1)
    }

    // 初始化数据库
    const dbInitialized = await DatabaseMigration.initialize()
    if (!dbInitialized) {
      console.log('⚠️ 数据库表初始化失败，但服务将继续启动')
      console.log('💡 请检查数据库配置并手动运行: npx prisma db push')
    }

    // 启动服务器
    serve({
      fetch: app.fetch,
      port: config.port,
    })
    
    console.log(`✅ 服务器正在运行在端口 ${config.port}`)
  } catch (error) {
    console.error('❌ 服务启动失败:', error)
    process.exit(1)
  }
}

startServer()

