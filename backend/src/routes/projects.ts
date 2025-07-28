/**
 * 项目路由定义
 * 提供项目相关的 RESTful API 路由
 */
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import {
  PaginationSchema,
  ProjectSchema,
  ProjectUpdateSchema,
  ProjectBatchCreateSchema,
  ProjectBatchDeleteSchema,
  ProjectDeleteSchema
} from '../validators/project'
import { ProjectService } from '../services/project.service'
import { config } from '../config'


const projects = new Hono()


// 获取项目列表
projects.get('/', zValidator('query', PaginationSchema),
  async (c) => {
    try {
      const query = c.req.valid('query')
      const { page, limit, search } = query
      const result = await ProjectService.findMany({ page, limit, search })
      return c.json(result)
    } catch (error) {
      console.error('获取项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }

  }
)

// 创建新项目
projects.post('/add', zValidator('json', ProjectSchema),
  async (c) => {
    try {
      const data = c.req.valid('json')
      const project = await ProjectService.create(data)
      return c.json({
        success: true,
        message: '项目创建成功',
        data: project
      }, 201)
    } catch (error) {
      if (error instanceof Error && error.message === '项目名称已存在') {
        return c.json({ success: false, error: error.message }, 400)
      }
      console.error('创建项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
  }
)

// 更新项目
projects.put('/update', zValidator('json', ProjectUpdateSchema),
  async (c) => {
    try {
      const data = c.req.valid('json')
      const project = await ProjectService.update(data)
      return c.json({
        success: true,
        message: '项目更新成功',
        data: project
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === '项目不存在') {
          return c.json({ success: false, error: error.message }, 404)
        }
        if (error.message === '项目名称已存在') {
          return c.json({ success: false, error: error.message }, 400)
        }
      }
      console.error('更新项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
  }
)

// 删除项目
projects.delete('/delete', zValidator('json', ProjectDeleteSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('json')
      await ProjectService.delete(id)
      return c.json({ success: true, message: '项目删除成功' })
    } catch (error) {
      if (error instanceof Error && error.message === '项目不存在') {
        return c.json({ success: false, error: error.message }, 404)
      }
      console.error('删除项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)

    }
  }
)

// 批量创建项目
projects.post('/add/batch', zValidator('json', ProjectBatchCreateSchema),
  async (c) => {
    try {
      const projectsData = c.req.valid('json')
      const { result, existing } = await ProjectService.createMany(projectsData)

      const message = existing.length > 0
        ? `批量创建完成，成功创建 ${result.count} 个项目，跳过 ${existing.length} 个重复项目`
        : `批量创建成功，共创建 ${result.count} 个项目`

      return c.json({
        success: true,
        message,
        data: { created: result.count, skipped: existing.length }
      }, 201)
    } catch (error) {
      console.error('批量创建项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }

  }
)

// 批量删除项目
projects.delete('/delete/batch', zValidator('json', ProjectBatchDeleteSchema),
  async (c) => {
    try {
      const ids = c.req.valid('json')
      const result = await ProjectService.deleteMany(ids)
      return c.json({
        success: true,
        message: `批量删除成功，共删除 ${result.count} 个项目`,
        data: { deleted: result.count }
      })
    } catch (error) {
      console.error('批量删除项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
  }
)

// 删除所有项目
projects.delete('/delete/all',
  async (c) => {
    try {
      const result = await ProjectService.deleteAll()
      return c.json({
        success: true,
        message: `删除所有项目成功，共删除 ${result.count} 个项目`,
        data: { deleted: result.count }
      })
    } catch (error) {
      console.error('删除所有项目时出错:', error)
      return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
  }
)

// 获取排除的项目名称
projects.get('/exclude-names', (c) => {
  const excludeProjectNames = config.excludeProjectNames
  return c.json({
    success: true,
    data: excludeProjectNames
  })
})

export default projects