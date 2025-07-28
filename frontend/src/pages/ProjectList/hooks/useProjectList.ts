// 自定义 Hook 管理状态
// Hook 用于处理项目列表的状态和逻辑
import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { message } from 'antd'
import { fetchProjects, deleteProject } from '@/api/projectService'
import type { Project, ProjectsResponse } from '@/types/project'

// 自定义 Hook
export const useProjectList = () => {
  // const [isLoading, setIsLoading] = useState(false) // 加载状态
  const [page, setPage] = useState(1) // 当前页码
  const [limit, setLimit] = useState(10) // 每页显示的项目数量
  const [search, setSearch] = useState('') // 搜索关键词
  const [modalVisible, setModalVisible] = useState(false) // 控制模态框的显示和隐藏
  const [modalType, setModalType] = useState<'new' | 'batch' | null>(null) // 模态框类型：新建或批量添加
  const [currentProject, setCurrentProject] = useState<Project | null>(null) // 当前编辑的项目
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]) // 选中的行键
  const [selectedChinaRegion, setSelectedChinaRegion] = useState<React.Key[]>([]) // 省市县筛选

  const {
    data: projectsData,
    isLoading,
    isError,
    refetch
  } = useQuery<ProjectsResponse>({
    queryKey: ['projects', page, limit, search, selectedChinaRegion],
    queryFn: async () => await fetchProjects(page, limit, search, selectedChinaRegion),
    staleTime: 1000 * 60 * 5, // 数据在5分钟内不会过期
    // placeholderData: keepPreviousData,
  })

  // 处理搜索
  // 例如：输入搜索关键词时调用
  const handleSearch = (value: string) => {
    setSearch(value) // 更新搜索关键词
    setPage(1) // 重置页码为1
  }

  // 处理删除项目
  // 例如：点击删除按钮时调用
  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id)
      message.success('项目删除成功')
      refetch()
    } catch (error) {
      message.error('删除项目失败')
    }
  }

  // 处理编辑项目
  const handleEdit = (project: Project) => {
    setCurrentProject(project) // 设置当前编辑的项目
    setModalType('new') // 设置模态框类型为编辑
    setModalVisible(true) // 打开模态框
  }

  // 处理新建项目
  // 例如：点击新建按钮时打开模态框
  const handleNewProject = () => {
    setCurrentProject(null) // 清空当前项目
    setModalType('new') // 设置模态框类型为新建
    setModalVisible(true) // 打开模态框
  }

  // 批量添加项目
  const handleBatchAdd = () => {
    setCurrentProject(null) // 清空当前项目
    setModalType('batch') // 设置模态框类型为批量添加
    setModalVisible(true) // 打开模态框
  }

  // 处理模态框关闭
  // 例如：取消添加或编辑项目
  const handleModalClose = () => {
    setModalVisible(false) // 关闭模态框
    setCurrentProject(null) // 清空当前项目
  }

  // 处理模态框成功操作
  // 例如：添加或编辑项目后刷新数据
  const handleModalSuccess = () => {
    setModalVisible(false) // 关闭模态框
    setCurrentProject(null) // 清空当前项目
    refetch() // 刷新项目列表数据
  }

  // 分页处理
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
    selectedChinaRegion,
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
    setSelectedChinaRegion,
    refetch,
  }
}