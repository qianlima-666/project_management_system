/**
 * 端口工具函数
 * 
 * 提供端口相关的实用工具函数
 * 主要用于检查指定端口是否被占用
 * 在服务启动前进行端口可用性检查，避免端口冲突
 */
import net from 'net'

export async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', () => resolve(true))
    server.once('listening', () => {
      server.close(() => resolve(false))
    })
    server.listen(port)
  })
}