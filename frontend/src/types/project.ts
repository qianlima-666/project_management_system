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