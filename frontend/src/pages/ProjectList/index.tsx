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
      <Card variant="outlined">
        <ProjectHeader
          selectedRowKeys={selectedRowKeys}
          onSearch={handleSearch}
          onNewProject={handleNewProject}
          onBatchAdd={handleBatchAdd}
          onRefetch={refetch}
          setSelectedRowKeys={setSelectedRowKeys}
        />

        <ProjectTable
          data={projectsData?.data || []}
          loading={isLoading}
          error={isError || !projectsData?.success}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ProjectPagination
          current={page}
          pageSize={limit}
          total={projectsData?.pagination?.total || 0}
          selectedCount={selectedRowKeys.length}
          onChange={handlePaginationChange}
        />
      </Card>

      <NewProject
        visible={modalVisible && modalType === 'new'}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
        project={currentProject}
      />

      <BatchAddProject
        visible={modalVisible && modalType === 'batch'}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

export default ProjectList