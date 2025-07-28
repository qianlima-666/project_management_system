/**
 * 端口工具函数
 * 
 * 提供端口相关的实用工具函数
 * 主要用于检查指定端口是否被占用
 * 在服务启动前进行端口可用性检查，避免端口冲突
 */
import net from 'net'

/**
 * 检查指定端口是否被占用
 * 
 * @param port - 要检查的端口号
 * @returns Promise<boolean> - 如果端口被占用返回 true，否则返回 false
 * 
 * 使用 net 模块创建一个服务器实例，尝试监听指定端口
 * 如果监听成功，说明端口未被占用，返回 false
 * 如果监听失败（抛出错误），说明端口已被占用，返回 true
 */
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