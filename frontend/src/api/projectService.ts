/**
 * 项目管理系统前端 API 服务
 * 提供与后端项目相关的 API 调用
 * 包括项目的增删改查及批量操作
 */
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 项目接口响应格式
export interface Project {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

// 分页接口响应格式
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// API响应格式
export interface ApiResponse<T> {
  success: boolean
  data: T
  pagination?: Pagination
  message?: string
  error?: string
}

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取项目列表
export const fetchProjects = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ApiResponse<Project[]>> => {
  const response = await apiClient.get('/projects', {
    params: { page, limit, search }
  })
  return response.data
}

// 创建项目
export const addProject = async (
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Project>> => {
  const response = await apiClient.post('/projects/add', project)
  return response.data
}

// 更新项目
export const updateProject = async (
  id: number,
  project: Partial<Project>
): Promise<ApiResponse<Project>> => {
  const response = await apiClient.put(`/projects/update`, { id, ...project })
  return response.data
}

// 删除项目
export const deleteProject = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/projects/delete`, { data: { id } })
  return response.data
}

// 批量创建项目
export const batchAddProjects = async (
  projects: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>[]
): Promise<ApiResponse<Project[]>> => {
  const response = await apiClient.post('/projects/add/batch', projects)
  return response.data
}

// 批量删除项目
export const batchDeleteProjects = async (ids: number[]): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete('/projects/delete/batch', { data: ids })
  return response.data
}

// 删除所有项目
export const deleteAllProjects = async (): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete('/projects/delete/all')
  return response.data
}

// 获取排除的项目名称
export const getExcludeProjectNames = async (): Promise<ApiResponse<string[]>> => {
  const response = await apiClient.get('/projects/exclude-names')
  return response.data
}