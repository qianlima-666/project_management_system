// 表格组件
import React from 'react'
import { Table, Button, Space, Popconfirm, Spin } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { Project } from '@/types/project'

interface ProjectTableProps {
  data: Project[]
  loading: boolean
  error: boolean
  selectedRowKeys: React.Key[]
  onSelectionChange: (keys: React.Key[]) => void
  onEdit: (project: Project) => void
  onDelete: (id: number) => void
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  data,
  loading,
  error,
  selectedRowKeys,
  onSelectionChange,
  onEdit,
  onDelete
}) => {
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
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="确认删除该项目?"
            onConfirm={() => onDelete(record.id)}
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
    <Spin spinning={loading}>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectionChange,
        }}
        columns={columns}
        dataSource={data}
        locale={error || data === null ? {
          emptyText: <div style={{ textAlign: 'center', margin: 20 }}>加载项目失败，请稍后重试</div>,
        } : {}}
        rowKey="id"
        pagination={false}
        className="project-table"
        // 设置表格高度，避免过高导致滚动条不友好
        scroll={{ y: 'calc(100vh - 320px)' }}
        bordered
      />
    </Spin>
  )
}

export default ProjectTable