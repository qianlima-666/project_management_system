/**
 * 项目数据验证器
 * 
 * 使用 Zod 库定义项目相关的数据验证规则
 * 包括项目创建、更新、删除、批量操作等场景的验证
 * 确保 API 接收到的数据格式正确且符合业务规则
 */
import { z } from 'zod'

// 分页查询的验证规则
export const PaginationSchema = z.object({
  page: z.string().transform(Number),
  limit: z.string().transform(Number),
  search: z.string().optional(),
})

// 项目创建的验证规则
export const ProjectSchema = z.object({
  name: z.string().min(1, '项目名称不能为空').max(255, '项目名称过长'),
  description: z.string().nullable().optional(),
})

// 项目更新的验证规则
export const ProjectUpdateSchema = ProjectSchema.extend({
  id: z.number().int().positive(),
})

// 单个项目删除的验证规则
export const ProjectDeleteSchema = z.object({
  id: z.number().int().positive()
})

// 批量创建项目的验证规则
export const ProjectBatchCreateSchema = z.array(ProjectSchema).min(1, '至少需要一个项目数据')

// 批量删除项目的验证规则
export const ProjectBatchDeleteSchema = z.array(z.number().int().positive()).min(1, '至少需要一个ID')
