/**
 * 数据库连接管理器
 * 
 * 单例模式管理 Prisma 数据库连接
 * 提供数据库连接、断开、健康检查等功能
 * 统一管理数据库实例，避免重复连接
 * 包含连接状态监控和错误处理
 */
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { PrismaClientInitializationError } from '@prisma/client/runtime/library'

// 数据库连接管理器
export class DatabaseConnection {
  private static instance: PrismaClient

  // 获取单例实例
  static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient({
        log: ['error'],
      })
    }
    return DatabaseConnection.instance
  }

  // 连接、断开和健康检查方法
  static async connect() {
    try {
      const prisma = DatabaseConnection.getInstance()
      await prisma.$connect()
      console.log('✅ 数据库连接成功')

      await prisma.$queryRaw`SELECT 1`
      console.log('✅ 数据库查询测试成功')

    } catch (error) {
      // "PrismaClientInitializationError" 是 Prisma 客户端初始化错误
      if (error instanceof PrismaClientInitializationError) {
        console.error('❌ 数据库连接失败，可能是 Prisma 客户端错误，请下载对应的 版本，或手动执行 npx prisma generate')
        process.exit(1)
      } else {
        console.error('❌ 数据库连接失败:', error)
        process.exit(1)
      }
    }
  }

  // 断开数据库连接
  static async disconnect(): Promise<void> {
    try {
      const prisma = DatabaseConnection.getInstance()
      await prisma.$disconnect()
      console.log('✅ 数据库连接已断开')
    } catch (error) {
      console.error('❌ 断开数据库连接时出错:', error)
    }
  }

  // 健康检查方法
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