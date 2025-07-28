// 主组件
// 该组件使用自定义 Hook 来获取项目列表的状态和处理逻辑
import React from 'react'
import { Card } from 'antd'
import ProjectHeader from './components/ProjectHeader'
import ProjectTable from './components/ProjectTable'
import ProjectPagination from './components/ProjectPagination'
import NewProject from './components/NewProject'
import BatchAddProject from './components/BatchAddProject'
import { useProjectList } from './hooks/useProjectList'


const ProjectList: React.FC = () => {
  const {
    page,
    limit,
    modalVisible,
    modalType,
    currentProject,
    selectedRowKeys,
    projectsData,
    isLoading,
    isError,
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
  } = useProjectList()

  return (
    <>
      {/* 项目列表头部 */}
      <Card variant="outlined">
        {/* 项目搜索和操作 */}
        <ProjectHeader
          selectedRowKeys={selectedRowKeys}
          onSearch={handleSearch}
          onNewProject={handleNewProject}
          onBatchAdd={handleBatchAdd}
          onRefetch={refetch}
          setSelectedRowKeys={setSelectedRowKeys}
        />

        {/* 项目列表表格 */}
        <ProjectTable
          data={projectsData?.data || []}
          loading={isLoading}
          error={isError || !projectsData?.success}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* 项目列表分页 */}
        <ProjectPagination
          current={page}
          pageSize={limit}
          total={projectsData?.pagination?.total || 0}
          selectedCount={selectedRowKeys.length}
          onChange={handlePaginationChange}
        />
      </Card>

      {/* 新建项目模态框 */}
      <NewProject
        visible={modalVisible && modalType === 'new'}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        project={currentProject}
      />

      {/* 批量添加项目模态框 */}
      <BatchAddProject
        visible={modalVisible && modalType === 'batch'}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

export default ProjectList