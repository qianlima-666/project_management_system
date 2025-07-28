// 主组件
// 该组件使用自定义 Hook 来获取项目列表的状态和处理逻辑
import React from 'react'
import { Card, Layout } from 'antd'
import SideBar from './components/SideBar'
import ProjectHeader from './components/ProjectHeader'
import ProjectTable from './components/ProjectTable'
import ProjectPagination from './components/ProjectPagination'
import NewProject from './components/NewProject'
import BatchAddProject from './components/BatchAddProject'
import { useProjectList } from './hooks/useProjectList'


const { Content } = Layout

// 项目列表页面组件
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
    selectedChinaRegion,
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
    refetch
  } = useProjectList()


  return (
    <Layout style={{ background: 'none', minHeight: 'calc(100vh - 130px)' }}>
      {/* 侧边栏 */}
      <SideBar
        selectedChinaRegion={selectedChinaRegion}
        setSelectedChinaRegion={setSelectedChinaRegion}
      />

      {/* 主内容区 */}
      <Content style={{ paddingLeft: 24 }}>
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
      </Content>
    </Layout>
  )
}

export default ProjectList