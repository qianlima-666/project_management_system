// 定义项目相关的 TypeScript 类型

// 项目 类型
export interface Project {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

// 分页 类型
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 获取项目 API 响应格式
export interface ProjectsResponse {
  success: boolean
  data: Project[]
  pagination?: Pagination
}