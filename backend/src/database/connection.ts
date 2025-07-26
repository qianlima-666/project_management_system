/**
 * 数据库连接管理器
 * 
 * 单例模式管理 Prisma 数据库连接
 * 提供数据库连接、断开、健康检查等功能
 * 统一管理数据库实例，避免重复连接
 * 包含连接状态监控和错误处理
 */
import { PrismaClient } from '@prisma/client'
import { config } from '../config'

export class DatabaseConnection {
  private static instance: PrismaClient
  
  static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient({
        log: config.nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      })
    }
    return DatabaseConnection.instance
  }
  
  static async connect(): Promise<boolean> {
    try {
      const prisma = DatabaseConnection.getInstance()
      await prisma.$connect()
      console.log('✅ 数据库连接成功')
      
      await prisma.$queryRaw`SELECT 1`
      console.log('✅ 数据库查询测试成功')
      
      return true
    } catch (error) {
      console.error('❌ 数据库连接失败:', error)
      return false
    }
  }
  
  static async disconnect(): Promise<void> {
    try {
      const prisma = DatabaseConnection.getInstance()
      await prisma.$disconnect()
      console.log('✅ 数据库连接已断开')
    } catch (error) {
      console.error('❌ 断开数据库连接时出错:', error)
    }
  }
  
  static async healthCheck() {
    try {
      const prisma = DatabaseConnection.getInstance()
      await prisma.$queryRaw`SELECT 1`
      return { status: 'healthy', message: '数据库连接正常' }
    } catch (error) {
      return { status: 'unhealthy', message: '数据库连接异常', error }
    }
  }
}

export const prisma = DatabaseConnection.getInstance()