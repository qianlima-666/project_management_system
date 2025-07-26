// 分页组件
import React from 'react'
import { Pagination } from 'antd'

interface ProjectPaginationProps {
  current: number
  pageSize: number
  total: number
  selectedCount: number
  onChange: (page: number, pageSize: number) => void
}

const ProjectPagination: React.FC<ProjectPaginationProps> = ({
  current,
  pageSize,
  total,
  selectedCount,
  onChange
}) => {
  return (
    <div className="pagination-container">
      <Pagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger
        showQuickJumper
        showTotal={(total: number) => `已选 ${selectedCount} / ${total}`}
      />
    </div>
  )
}

export default ProjectPagination