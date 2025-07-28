// 定义项目相关的 TypeScript 类型

export interface Project {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ProjectsResponse {
  success: boolean
  data: Project[]
  pagination?: Pagination
}