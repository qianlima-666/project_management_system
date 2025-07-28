/**
 * 项目列表页头部操作栏组件
 * 包含搜索、新建、批量添加、批量删除、清空等操作
 */
import React from 'react'
import { Input, Button, Space, Typography, Popconfirm, message } from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { batchDeleteProjects, deleteAllProjects } from '@/api/projectService'

const { Title } = Typography

interface ProjectHeaderProps {
  selectedRowKeys: React.Key[]
  onSearch: (value: string) => void
  onNewProject: () => void
  onBatchAdd: () => void
  onRefetch: () => void
  setSelectedRowKeys: (keys: React.Key[]) => void
}

/**
 * 项目列表头部操作栏
 */
const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  selectedRowKeys,
  onSearch,
  onNewProject,
  onBatchAdd,
  onRefetch,
  setSelectedRowKeys
}) => {
  const [searchValue, setSearchValue] = React.useState('')
  // 批量删除选中项目
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的项目')
      return
    }
    const ids = selectedRowKeys.map(key => Number(key))
    const results = await batchDeleteProjects(ids)
    if (results.success) {
      message.success(results.message)
      setSelectedRowKeys([])
      onRefetch()
    } else {
      message.error(results.error)
    }
  }

  // 删除所有项目
  const handleDeleteAll = async () => {
    const results = await deleteAllProjects()
    if (results.success) {
      message.success(results.message)
      onRefetch()
    } else {
      message.error(results.error)
    }
  }

  return (
    <div
      className="project-header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <Title level={3} className="project-title" style={{ margin: 0 }}>
          项目管理
        </Title>
        <Typography.Text type="secondary" className="project-subtitle">
          管理您的项目，支持新建、编辑、删除和批量添加。
        </Typography.Text>
      </div>

      <Space
        size="middle"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <Input
          placeholder="搜索项目..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={() => onSearch(searchValue)}
          style={{ width: 240 }}
          maxLength={32}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => onSearch(searchValue)}
        ></Button>

        <Button type="primary" icon={<PlusOutlined />} onClick={onNewProject}>
          新建项目
        </Button>
        
        <Button type="primary" icon={<UploadOutlined />} onClick={onBatchAdd}>
          批量添加
        </Button>

        <Popconfirm
          title="确认删除选中项目？"
          onConfirm={handleBatchDelete}
          okText="确认"
          cancelText="取消"
          disabled={!selectedRowKeys.length}
        >
          <Button
            type="primary"
            danger
            disabled={!selectedRowKeys.length}
          >
            删除选中项目
          </Button>
        </Popconfirm>

        <Popconfirm
          title="确认删除所有项目？"
          onConfirm={handleDeleteAll}
          okText="确认"
          cancelText="取消"
        >
          <Button type="dashed" danger icon={<DeleteOutlined />}>
            删除所有项目
          </Button>
        </Popconfirm>
      </Space>
    </div>
  )
}

export default ProjectHeader