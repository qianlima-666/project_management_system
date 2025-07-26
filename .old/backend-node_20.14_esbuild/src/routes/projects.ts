import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { redisClient } from '../lib/redis'

const prisma = new PrismaClient()
const projects = new Hono()

// 模式
const ProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
})
const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
})

// 生成缓存键
const getCacheKey = (params: {
  page: number
  limit: number
  search?: string
}): string => {
  return `projects:page:${params.page}:limit:${params.limit}:search:${params.search || ''}`
}

// 获取所有项目（带分页和搜索）
projects.get(
  '/',
  zValidator(
    'query',
    PaginationSchema.extend({
      page: z.string().transform(Number),
      limit: z.string().transform(Number),
    })
  ),
  async (c) => {
    const { page, limit, search } = c.req.valid('query')
    const skip = (page - 1) * limit
    const cacheKey = getCacheKey({ page, limit, search })

    try {
      // 尝试获取缓存数据
      const cachedData = await redisClient.get(cacheKey)
      if (cachedData) {
        return c.json(JSON.parse(cachedData))
      }

      // 查询数据库
      const where = search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }
        : {}

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.project.count({ where }),
      ])

      const totalPages = Math.ceil(total / limit)

      const response = {
        success: true,
        data: projects,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      }

      // 缓存响应 60 秒
      await redisClient.setEx(cacheKey, 60, JSON.stringify(response))

      return c.json(response)
    } catch (error) {
      console.error('获取项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
  }
)

// 创建新项目
projects.post('/add', zValidator('json', ProjectSchema),
  async (c) => {
    const { name, description } = c.req.valid('json')

    try {
      // 检查项目名称是否已存在
      const existingProject = await prisma.project.findUnique({
        where: { name },
      })
      if (existingProject) {
        return c.json({ success: false, error: '项目名称已存在' }, 200)
      }

      const project = await prisma.project.create({
        data: {
          name,
          description,
        },
      })

      // 清除相关缓存
      const pattern = 'projects:page:*'
      const keys = await redisClient.keys(pattern)
      if (keys.length > 0) {
        await redisClient.del(keys)
      }

      return c.json({ success: true, message: '项目创建成功', data: project }, 201)
    } catch (error) {
      console.error('创建项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
  })

// 更新项目
const ProjectUpdateSchema = ProjectSchema.extend({
  id: z.number().int().positive(),
})
projects.put('/update', zValidator('json', ProjectUpdateSchema),
  async (c) => {
    const { id, name, description } = c.req.valid('json')

    try {
      // 检查项目名称是否已存在
      const existingProject = await prisma.project.findUnique({
        where: { name },
      })
      if (existingProject && existingProject.id !== id) {
        return c.json({ success: false, error: '项目名称已存在' }, 200)
      }

      const project = await prisma.project.update({
        where: { id },
        data: { name, description },
      })

      // 清除相关缓存
      const pattern = `projects:page:*`
      const keys = await redisClient.keys(pattern)
      if (keys.length > 0) {
        await redisClient.del(keys)
      }

      return c.json({ success: true, message: '项目更新成功', data: project })
    } catch (error) {
      console.error('更新项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
  })

// 删除项目
projects.delete('/delete', zValidator('json', z.number()),
  async (c) => {
    const id = c.req.valid('json')

    try {
      await prisma.project.delete({ where: { id } })

      // 清除相关缓存
      const pattern = `projects:page:*`
      const keys = await redisClient.keys(pattern)
      if (keys.length > 0) {
        await redisClient.del(keys)
      }

      return c.json({ success: true, message: '项目删除成功' })
    } catch (error) {
      console.error('删除项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
  })

// 批量创建项目
projects.post('/add/batch', zValidator('json', z.array(ProjectSchema)),
  async (c) => {
    const projects = c.req.valid('json')
    try {
      // 检查重复项目名称
      const names = projects.map(p => p.name)
      const existingProjects = await prisma.project.findMany({
        where: { name: { in: names } },
        select: { name: true }
      })

      const result = await prisma.project.createMany({
        data: projects,
        skipDuplicates: true, // 跳过重复项
      })

      // 清除相关缓存
      const pattern = 'projects:page:*'
      const keys = await redisClient.keys(pattern)
      if (keys.length > 0) {
        await redisClient.del(keys)
      }

      // return c.json({
      //   success: true,
      //   message: `已创建 ${result.count}/${projects.length} 个项目，${existingProjects.length}个项目名称已存在（没有被创建）`,
      //   data: existingProjects
      // }, 200)

      if (result.count === 0) {
        return c.json({ success: false, error: '没有新项目被创建（所有项目名称都已存在）' }, 200)
      } else if (existingProjects.length > 0) {
        return c.json({
          success: true,
          message: `已创建 ${result.count}/${projects.length} 个项目，${existingProjects.length}个项目名称已存在（没有被创建）`,
          data: existingProjects
        }, 200)
      } else {
        return c.json({
          success: true,
          message: `已创建所有项目（共${result.count}个）`,
          data: result
        }, 200)
      }

    } catch (error) {
      console.error('批量创建项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }

  })

// 批量删除项目
projects.delete('/delete/batch', zValidator('json', z.array(z.number())), async (c) => {
  const ids = c.req.valid('json')
  try {
    const result = await prisma.project.deleteMany({
      where: { id: { in: ids } },
    })

    // 清除相关缓存
    const pattern = `projects:page:*`
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(keys)
    }

    return c.json({ success: true, message: `项目删除成功,共删除了${result.count}个` }, 200)
  } catch (error) {
    console.error('删除项目时出错:', error)
    return c.json({ success: false, error: '服务器内部错误' }, 500)
  }
})

// 删除所有项目
projects.delete('/delete/all', async (c) => {
  try {
    const result = await prisma.project.deleteMany({}) // 删除所有项目

    // 清除相关缓存
    const pattern = 'projects:page:*'
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(keys)
    }
    if (result.count === 0) {
      return c.json({ success: false, error: '删除设备（没有项目存在）' }, 200)
    } else {
      return c.json({ success: true, message: `项目删除成功,共删除了${result.count}个项目` })
    }
  } catch (error) {
    console.error('删除所有项目时出错:', error)
    return c.json({ success: false, error: '服务器内部错误' }, 500)
  }
})

export default projects