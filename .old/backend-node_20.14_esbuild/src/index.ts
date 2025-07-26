import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serve } from '@hono/node-server'
import { redisClient } from './lib/redis'
import projects from './routes/projects'
import net from 'net'

const app = new Hono()

// 中间件
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000'],
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
)

// 路由
app.route('/api/projects', projects)

// 健康检查
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// 清除
process.on('SIGINT', async () => {
  await redisClient.quit()
  process.exit()
})

const port = 3001;
// 判断 端口是否被占用
(async () => {
  if (await isPortInUse(port)) {
    console.log(`❌ 端口 ${port} 已被占用，请更换端口号`)
    process.exit(1)
  }
  else {
    serve({
      fetch: app.fetch,
      port,
    })
    console.log(`✅ 服务器正在运行在端口 ${port}`)
  }
})()


async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', () => {
      resolve(true)
    })
    server.once('listening', () => {
      server.close(() => {
        resolve(false)
      })
    })
    server.listen(port)
  })
}

