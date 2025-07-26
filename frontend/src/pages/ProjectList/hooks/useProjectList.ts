// 自定义 Hook 管理状态
// Hook 用于处理项目列表的状态和逻辑
import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { message } from 'antd'
import { fetchProjects, deleteProject } from '@/api/projectService'
import type { Project, ProjectsResponse } from '@/types/project'

export const useProjectList = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'new' | 'batch' | null>(null)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const {
    data: projectsData,
    isLoading,
    isError,
    refetch
  } = useQuery<ProjectsResponse>({
    queryKey: ['projects', page, limit, search],
    queryFn: () => fetchProjects(page, limit, search),
    placeholderData: keepPreviousData,
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id)
      message.success('项目删除成功')
      refetch()
    } catch (error) {
      message.error('删除项目失败')
    }
  }

  const handleEdit = (project: Project) => {
    setCurrentProject(project)
    setModalType('new')
    setModalVisible(true)
  }

  const handleNewProject = () => {
    setCurrentProject(null)
    setModalType('new')
    setModalVisible(true)
  }

  const handleBatchAdd = () => {
    setCurrentProject(null)
    setModalType('batch')
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }

  const handleModalSuccess = () => {
    setModalVisible(false)
    refetch()
  }

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page)
    setLimit(pageSize)
  }

  return {
    // 状态
    page,
    limit,
    search,
    modalVisible,
    modalType,
    currentProject,
    selectedRowKeys,
    projectsData,
    isLoading,
    isError,
    
    // 方法
    handleSearch,
    handleDelete,
    handleEdit,
    handleNewProject,
    handleBatchAdd,
    handleModalClose,
    handleModalSuccess,
    handlePaginationChange,
    setSelectedRowKeys,
    refetch
  }
}