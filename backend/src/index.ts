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
import { log } from 'node:console'

console.log('🚀 项目管理系统后端服务启动中...')

const app = createApp()

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n\n👋 服务已停止')
  console.log('🔄 正在关闭服务...')
  await Promise.all([
    redisClient.quit(),
    DatabaseConnection.disconnect(),
  ])
  console.log('✅ 服务已成功关闭')
  console.log('👋 感谢使用项目管理系统！')
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
    await DatabaseConnection.connect()

    // 初始化数据库
    await DatabaseMigration.initialize()

    // 启动服务器
    serve({
      fetch: app.fetch,
      port: config.port,
    })

    console.log(`\n\n🎉 服务已成功启动🚀！`);
    console.log(`🚀  后端服务已启动，正在运行在端口 ${config.port}`)
    console.log(`🌐 访问地址: http://localhost:${config.port}`);
    console.log(`🌐 已授权前端域名: ${config.cors.origin.join(', ')}`)
    console.log(`🌐 批量上传 排除的项目名称: ${config.excludeProjectNames.join(', ')}`)

  } catch (error) {
    console.error('❌ 服务启动失败:', error)
    process.exit(1)
  }
}

startServer()

