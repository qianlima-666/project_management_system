/**
 * 日志服务层
 * 负责系统操作日志的记录、查询、统计
 */
import { prisma } from '../database/connection'

export interface LogCreateData {
  operation: '创建(CREATE)' | '更新(UPDATE)' | '删除(DELETE)' | '批量创建(BATCH_CREATE)' | '批量删除(BATCH_DELETE)' | '删除所有(DELETE_ALL)'
  tableName: string
  oldData?: any
  newData?: any
  description?: string
}

export interface LogQueryParams {
  page: number
  limit: number
  operation?: string
  tableName?: string
  startDate?: string
  endDate?: string
}

export class LogService {
  // 创建操作日志
  static async create(data: LogCreateData) {
    try {
      await prisma.log.create({
        data: {
          operation: data.operation,
          tableName: data.tableName,
          oldData: data.oldData ? JSON.parse(JSON.stringify(data.oldData)) : null,
          newData: data.newData ? JSON.parse(JSON.stringify(data.newData)) : null,
          description: data.description,
        },
      });
    } catch (error) {
      console.error('记录日志失败:', error)
    }
  }
  
  // 获取操作日志列表
  static async findMany(params: LogQueryParams) {
    const { page, limit, operation, tableName, startDate, endDate } = params
    const skip = (page - 1) * limit
    
    const where: any = {}
    
    if (operation) {
      where.operation = operation
    }
    
    if (tableName) {
      where.tableName = tableName
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }
    
    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.log.count({ where }),
    ])
    
    return {
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // 获取操作日志统计
  static async getStats() {
    const stats = await prisma.log.groupBy({
      by: ['operation'],
      _count: {
        id: true,
      },
    })
    
    return {
      success: true,
      data: stats.map(stat => ({
        operation: stat.operation,
        count: stat._count.id,
      })),
    }
  }
}