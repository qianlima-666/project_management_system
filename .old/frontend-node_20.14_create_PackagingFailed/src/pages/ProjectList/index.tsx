import React, { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  Table,
  Input,
  Button,
  Space,
  Card,
  Pagination,
  Spin,
  message,
  Typography,
  Popconfirm,
  Row
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { fetchProjects, deleteProject } from '@/api/projectService'
import NewProject from './components/NewProject'
import BatchAddProject from './components/BatchAddProject'
import type { Project, ProjectsResponse } from '@/types/project'
import { batchDeleteProjects, deleteAllProjects } from '@/api/projectService'

const { Title } = Typography

const ProjectList: React.FC = () => {
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a: Project, b: Project) => a.id - b.id
    },
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
      width: 180
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleString(),
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Project) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentProject(record)
              setModalType('new')
              setModalVisible(true)
            }}
          />
          <Popconfirm
            title="确认删除该项目?"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="project-container">
      <Card variant="outlined">
        <div className="project-header">
          <div style={{
            // 使标题和副标题在同一行
            display: 'flex',
            alignItems: 'center',
          }}>
            <Title level={3} className="project-title" style={{ top: 0, marginTop: 0 }}>
              项目管理
            </Title>
            <div style={{ width: 10 }}></div>
            <Typography.Text type="secondary" className="project-subtitle">
              管理您的项目，支持新建、编辑、删除和批量添加。
            </Typography.Text>
          </div>
          <Space>
            <Input
              placeholder="搜索项目..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setCurrentProject(null)
                setModalType('new')
                setModalVisible(true)
              }}
            >
              新建项目
            </Button>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => {
                setCurrentProject(null)
                setModalType('batch')
                setModalVisible(true)
              }}
            >
              批量添加（上传文件）
            </Button>

            <Popconfirm
              title="确认删除吗？"
              description="删除后无法恢复，请谨慎操作！"
              onConfirm={async () => {
                if (selectedRowKeys.length === 0) {
                  message.warning('请先选择要删除的项目')
                  return
                }
                const ids = selectedRowKeys.map(key => Number(key))
                const results = await batchDeleteProjects(ids)
                if (results.success) {
                  message.success(results.message)
                  setSelectedRowKeys([])
                  refetch()
                } else {
                  message.error(results.error)
                }
              }}
              okText="确认"
              cancelText="取消"
            >
              <Button type="primary" danger disabled={!selectedRowKeys.length}>删除选中项目</Button>
            </Popconfirm>

            <Popconfirm
              title="确认删除所有项目？"
              description="删除后无法恢复，请谨慎操作！"
              onConfirm={async () => {
                const results = await deleteAllProjects()
                if (results.success) {
                  message.success(results.message)
                  refetch()
                } else {
                  message.error(results.error)
                }
              }}
              okText="确认"
              cancelText="取消"
            >
              <Button type="dashed" danger icon={<DeleteOutlined />}>删除所有项目</Button>
            </Popconfirm>
          </Space>
        </div>

        {isError ? (
          <div className="error-message">
            加载项目失败，请稍后重试
          </div>
        ) : (

          <Spin spinning={isLoading}>
            <Table
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              columns={columns}
              dataSource={projectsData?.data || []}
              rowKey="id"
              pagination={false}
              className="project-table"
              scroll={{ y: 350 }}
            />
            <div className="pagination-container">
              <Pagination
                current={page}
                pageSize={limit}
                total={projectsData?.pagination?.total || 0}
                onChange={(page, pageSize) => {
                  setPage(page)
                  setLimit(pageSize)
                }}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `已选 ${selectedRowKeys.length} / ${total}`}
              />
            </div>
          </Spin>
        )}
      </Card>

      <NewProject
        visible={modalVisible && modalType === 'new'}
        onCancel={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false)
          refetch()
        }}
        project={currentProject}
      />

      <BatchAddProject
        visible={modalVisible && modalType === 'batch'}
        onCancel={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false)
          refetch()
        }}
      />
    </div>
  )
}

export default ProjectList