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

export class DatabaseMigration {
  // 数据库初始化
  static async initialize() {
    try {
      console.log('🔍 检查并初始化数据库...')

      // 检查表是否存在
      await this.checkRequiredTables()

    } catch (error) {
      console.error('❌ 数据库初始化失败:', error)
      process.exit(1)
    }
  }

  // 检查必需的表是否存在，如果不存在则尝试初始化
  private static async checkRequiredTables() {
    const models = this.getModelsFromSchema()
    for (const model of models) {
      const tableName = model.toLowerCase()
      if (typeof (prisma as any)[tableName]?.findFirst === 'function') {
        await (prisma as any)[tableName].findFirst()
        console.log(`\t✅ 数据表 ${model} 已存在`)
      } else {
        console.log(`\t❌ 数据表 ${model} 不存在`)
      }
    }
  }

  // 从 schema.prisma 文件中解析模型名称
  private static getModelsFromSchema(): string[] {
    const schemaPath = path.resolve(process.cwd(), 'prisma', 'schema.prisma')
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8')
    const modelRegex = /^model\s+(\w+)\s+{/gm
    const models: string[] = []
    let match

    while ((match = modelRegex.exec(schemaContent)) !== null) {
      models.push(match[1])
    }

    return models
  }
}