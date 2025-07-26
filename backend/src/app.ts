/**
 * Hono 应用程序配置
 * 
 * 创建和配置 Hono Web 应用实例
 * 设置中间件：CORS、日志记录等
 * 注册路由：项目管理、操作日志等
 * 提供健康检查接口
 * 是整个 Web 服务的核心配置文件
 */
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { config } from './config'
import { DatabaseConnection } from './database/connection'
import projects from './routes/projects'
import logs from './routes/logs'

export function createApp() {
  const app = new Hono()

  // 中间件
  app.use('*', logger())
  app.use('*', cors({
    origin: config.cors.origin,
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }))

  // 路由
  app.route('/api/projects', projects)
  app.route('/api/logs', logs)

  // 健康检查
  app.get('/health', async (c) => {
    const dbHealth = await DatabaseConnection.healthCheck()
    return c.json({ 
      status: 'ok',
      database: dbHealth,
      timestamp: new Date().toISOString()
    })
  })

  return app
}