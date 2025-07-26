/**
 * 数据库迁移管理器
 * 
 * 负责数据库表结构的自动初始化和迁移
 * 检查必要表的存在性，在开发环境自动执行 Prisma 迁移
 * 解析 schema.prisma 文件，验证数据库表结构完整性
 * 提供数据库初始化的自动化解决方案
 */
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { prisma } from './connection'
import { config } from '../config'

export class DatabaseMigration {
  // 数据库初始化
  static async initialize(): Promise<boolean> {
    try {
      console.log('🔍 检查并初始化数据库...')

      // 检查基本连接
      await prisma.$queryRaw`SELECT 1`

      // 检查表是否存在
      const hasRequiredTables = await this.checkRequiredTables()
      if (hasRequiredTables) {
        console.log('✅ 所有必需的表都已存在')
        return true
      }

      // 在非生产环境中自动迁移
      if (config.nodeEnv !== 'production') {
        return await this.runAutoMigration()
      } else {
        console.error('❌ 生产环境中检测到表不存在，请手动运行迁移')
        return false
      }
    } catch (error) {
      console.error('❌ 数据库初始化失败:', error)
      return false
    }
  }

  // 检查必需的表是否存在
  // 如果不存在则尝试自动迁移
  private static async checkRequiredTables(): Promise<boolean> {
    try {
      const models = this.getModelsFromSchema()

      for (const model of models) {
        const tableName = model.toLowerCase()
        if (typeof (prisma as any)[tableName]?.findFirst === 'function') {
          await (prisma as any)[tableName].findFirst()
        } else {
          return false
        }
      }
      return true
    } catch (error) {
      return false
    }
  }

  // 从 schema.prisma 文件中解析模型名称
  private static getModelsFromSchema(): string[] {
    const schemaPath = path.resolve(process.cwd(), '.prisma', 'client', 'schema.prisma')
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')
    const modelRegex = /^model\s+(\w+)\s+{/gm
    const models: string[] = []
    let match

    while ((match = modelRegex.exec(schemaContent)) !== null) {
      models.push(match[1])
    }

    return models
  }

  // 自动迁移数据库  生成 Prisma 客户端并推送数据库模式
  private static async runAutoMigration(): Promise<boolean> {
    try {
      console.log('📦 生成 Prisma 客户端...')
      execSync('npx prisma generate', { cwd: process.cwd(), stdio: 'inherit' })

      console.log('🚀 推送数据库模式...')
      execSync('npx prisma db push', { cwd: process.cwd(), stdio: 'inherit' })

      return await this.checkRequiredTables()
    } catch (error) {
      console.error('❌ 自动迁移失败:', error)
      console.log('💡 请手动运行: npx prisma db push')
      return false
    }
  }
}