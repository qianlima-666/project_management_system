/**
 * 项目服务层
 * 处理项目相关的所有业务逻辑，包括 CRUD、批量操作、缓存、日志
 */
import { prisma } from '../database/connection'
import { LogService } from './log.service'
import { CacheService } from './cache.service'

export interface ProjectCreateData {
  name: string
  description?: string | null
}

export interface ProjectUpdateData extends ProjectCreateData {
  id: number
}

export interface ProjectQueryParams {
  page: number
  limit: number
  search?: string
}

export class ProjectService {
  private static readonly CACHE_PREFIX = 'projects'
  private static readonly CACHE_TTL = 60

  // 查询项目列表，支持分页和搜索
  static async findMany(params: ProjectQueryParams) {
    const { page, limit, search } = params
    const skip = (page - 1) * limit
    const cacheKey = CacheService.generateKey(this.CACHE_PREFIX, { page, limit, search })
    
    // 尝试从缓存获取
    const cached = await CacheService.get(cacheKey)
    if (cached) {
      return cached
    }
    
    // 查询数据库
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}
    
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ])
    
    const result = {
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
    
    // 缓存结果
    await CacheService.set(cacheKey, result, this.CACHE_TTL)
    
    return result
  }
  
  // 创建单个项目
  static async create(data: ProjectCreateData) {
    // 检查名称唯一性
    const existing = await prisma.project.findUnique({
      where: { name: data.name },
    })
    
    if (existing) {
      throw new Error('项目名称已存在')
    }
    
    const project = await prisma.project.create({ data })
    
    // 记录日志
    await LogService.create({
      operation: '创建(CREATE)',
      tableName: 'Project',
      newData: project,
      description: `创建项目: ${project.name}`,
    })
    
    // 清除缓存
    await this.invalidateCache()
    
    return project
  }
  
  // 更新项目
  static async update(data: ProjectUpdateData) {
    const { id, ...updateData } = data
    
    // 获取原数据
    const oldProject = await prisma.project.findUnique({ where: { id } })
    if (!oldProject) {
      throw new Error('项目不存在')
    }
    
    // 检查名称唯一性
    if (updateData.name !== oldProject.name) {
      const existing = await prisma.project.findUnique({
        where: { name: updateData.name },
      })
      if (existing) {
        throw new Error('项目名称已存在')
      }
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    })
    
    // 记录日志
    await LogService.create({
      operation: '更新(UPDATE)',
      tableName: 'Project',
      oldData: oldProject,
      newData: project,
      description: `更新项目: ${project.name}`,
    })
    
    // 清除缓存
    await this.invalidateCache()
    
    return project
  }
  
  // 删除单个项目
  static async delete(id: number) {
    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) {
      throw new Error('项目不存在')
    }
    
    await prisma.project.delete({ where: { id } })
    
    // 记录日志
    await LogService.create({
      operation: '删除(DELETE)',
      tableName: 'Project',
      oldData: project,
      description: `删除项目: ${project.name}`,
    })
    
    // 清除缓存
    await this.invalidateCache()
    
    return true
  }
  
  // 批量创建项目
  static async createMany(projectsData: ProjectCreateData[]) {
    const names = projectsData.map(p => p.name)
    const existing = await prisma.project.findMany({
      where: { name: { in: names } },
      select: { name: true },
    })
    
    const result = await prisma.project.createMany({
      data: projectsData,
      skipDuplicates: true,
    })
    
    // 记录日志
    await LogService.create({
      operation: '批量创建(BATCH_CREATE)',
      tableName: 'Project',
      newData: projectsData,
      description: `批量创建项目: 成功创建 ${result.count}/${projectsData.length} 个项目`,
    })
    
    // 清除缓存
    await this.invalidateCache()
    
    return { result, existing }
  }
  
  // 批量删除项目
  static async deleteMany(ids: number[]) {
    const projects = await prisma.project.findMany({
      where: { id: { in: ids } },
    })
    
    const result = await prisma.project.deleteMany({
      where: { id: { in: ids } },
    })
    
    // 记录日志
    await LogService.create({
      operation: '批量删除(BATCH_DELETE)',
      tableName: 'Project',
      oldData: projects,
      description: `批量删除项目: 共删除了 ${result.count} 个项目`,
    })
    
    // 清除缓存
    await this.invalidateCache()
    
    return result
  }
  
  // 删除所有项目
  static async deleteAll() {
    const projects = await prisma.project.findMany()
    const result = await prisma.project.deleteMany({})
    
    // 记录日志
    await LogService.create({
      operation: '删除所有(DELETE_ALL)',
      tableName: 'Project',
      oldData: projects,
      description: `删除所有项目: 共删除了 ${result.count} 个项目`,
    })
    
    // 清除缓存
    await this.invalidateCache()
    
    return result
  }
  
  // 清除缓存
  private static async invalidateCache() {
    await CacheService.invalidatePattern(`${this.CACHE_PREFIX}:*`)
  }
}