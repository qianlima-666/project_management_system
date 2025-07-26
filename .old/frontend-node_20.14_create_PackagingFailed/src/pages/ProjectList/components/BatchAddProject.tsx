import React, { useState } from 'react'
import { Modal, Button, Upload, Table, message, Pagination, Spin, Input, Space } from 'antd'
import { SearchOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { batchAddProjects } from '@/api/projectService'

// 批量添加项目组件
interface BatchAddProps {
    visible: boolean
    onCancel: () => void
    onSuccess: () => void
}

// Excel 文件中项目的类型定义
interface ExcelProject {
    selected?: boolean
    name: string
    description?: string
}

// 创建项目的 API 响应类型
const handleDownloadTemplate = () => {
    // 创建一个简单的 Excel 模板
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
        ['项目名称', '项目描述'],
        ['示例项目A', '这是一个示例项目'],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, '模板');
    XLSX.writeFile(wb, '项目批量导入模板.xlsx');
};

const BatchAddProject: React.FC<BatchAddProps> = ({
    visible,
    onCancel,
    onSuccess,
}) => {
    const [excelProjects, setExcelProjects] = useState<Array<Record<string, any>>>([]) // 存储 Excel 解析后的原始数据
    const [projects, setProjects] = useState<ExcelProject[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [loading, setLoading] = useState(false)
    // 解析 Excel 文件
    const handleUpload = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const json: Array<Record<string, any>> = XLSX.utils.sheet_to_json(worksheet)
            setExcelProjects(json)
            // 将 Excel 数据映射为 ExcelProject 类型
            const mappedProjects: ExcelProject[] = json.map(item => ({
                selected: true, // 默认选中
                name: item["项目名称"] || '',
                description: item["项目描述"] || '',
            }))

            // 去重处理
            const unique: ExcelProject[] = Array.from(
                new Map(mappedProjects.map(p => [p.name, p])).values()
            )
            setProjects(unique)
            setSelectedRowKeys(unique.map(p => p.name)) // 默认全选
        }
        reader.readAsArrayBuffer(file)
        return false // 阻止自动上传
    }


    // 提交批量创建项目
    const handleSubmit = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('请至少选择一个项目')
            return
        }
        setLoading(true)
        try {
            // 用 name 匹配选中的项目 [{name: '项目1', description: '描述1'}, {name: '项目2', description: '描述2'}}]
            const selectedProjects = projects.filter(p => selectedRowKeys.includes(p.name))
            const results = await batchAddProjects(selectedProjects)
            if (results.success) {
                message.success(results.message)
            } else {
                message.error(results.error)
            }

            onSuccess()
            setProjects([])
            setSelectedRowKeys([])
        } catch (error) {
            message.error('批量创建失败')
        } finally {
            setLoading(false)
        }
    }

    // 表格列定义
    const columns = [
        { title: '项目名称', dataIndex: 'name', key: 'name' },
        { title: '项目描述', dataIndex: 'description', key: 'description' },
    ]

    // 搜索 与 分页 功能
    const [currentPage, setCurrentPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [pageSize, setPageSize] = useState(10)

    const filteredProjects = projects.filter(p => p.name.includes(searchText))
    const pagedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    // 处理搜索输入
    const handleSearch = (value: string) => {
        setSearchText(value)
        setCurrentPage(1)
    }

    return (
        <Modal
            title="批量导入项目"
            width={projects.length > 0 ? 1000 : 600}
            style={projects.length > 0 ? { top: 30 } : {}}
            open={visible}
            maskClosable={projects.length === 0}
            onCancel={() => {
                setProjects([])
                setSelectedRowKeys([])
                setSearchText('')
                setCurrentPage(1)
                onCancel()
            }}
            footer={[
                <Button key="cancel" onClick={() => {
                    setProjects([])
                    setSelectedRowKeys([])
                    setSearchText('')
                    setCurrentPage(1)
                    onCancel()
                }}>取消</Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                    disabled={projects.length === 0}
                >
                    提交
                </Button>,
            ]}
        >
            {projects.length === 0 && (
                <>
                    <Upload
                        accept=".xlsx,.xls"
                        showUploadList={false}
                        beforeUpload={handleUpload}
                        maxCount={1}
                        style={{ margin: 6 }}
                    >
                        <Button icon={<UploadOutlined />}>上传 Excel 文件</Button>
                    </Upload>

                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadTemplate}
                        style={{ margin: 6 }}
                    >
                        下载模板
                    </Button>
                </>
            )}

            {projects.length > 0 && (
                <>
                    <div style={{ marginBottom: 12, color: '#555', fontSize: 15 }}>
                        <span>
                            已上传 <b>{projects.length}</b> / <b>{excelProjects.length}</b> 个项目
                        </span>
                        {excelProjects.length - projects.length > 0 && (
                            <span style={{ marginLeft: 16, color: '#faad14' }}>
                                （已忽略 <b>{excelProjects.length - projects.length}</b> 个重复项目）
                            </span>
                        )}
                    </div>
                    <Space>
                        <Input
                            placeholder="搜索项目..."
                            prefix={<SearchOutlined />}
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 300 }}
                            value={searchText}
                        />
                    </Space>
                    <Spin spinning={loading}>
                        <Table
                            rowSelection={{
                                selectedRowKeys,
                                onChange: (selectedRowKeys) => {
                                    // 获取 pagedProjects 的 name 列表
                                    const pagedProjectsNames = pagedProjects.map(p => p.name);

                                    // 遍历 projects，对 name 在 pagedProjectsNames 中的项目设置 selected
                                    projects.forEach(p => {
                                        if (pagedProjectsNames.includes(p.name)) {
                                            p.selected = false;
                                            if (selectedRowKeys.includes(p.name)) {
                                                p.selected = true;
                                            }
                                        }
                                    });
                                    // 获取 projects 中被选中的项目的 name 列表
                                    setSelectedRowKeys([]);
                                    const selectedNames = projects.filter(p => p.selected).map(p => p.name);
                                    setSelectedRowKeys(selectedNames);
                                },
                                type: 'checkbox',
                                onSelectAll: (selected) => {
                                    if (selected) {
                                        // 全选所有项目
                                        projects.forEach(p => p.selected = true)
                                        setSelectedRowKeys(projects.map(p => p.name));
                                    } else {
                                        // 取消全选
                                        projects.forEach(p => p.selected = false)
                                        setSelectedRowKeys([]);
                                    }
                                },
                            }}
                            columns={columns}
                            dataSource={pagedProjects.map((p) => ({
                                ...p,
                                key: p.name,
                            }))}
                            pagination={false}
                            style={{ marginTop: 10, height: 400 }}
                            scroll={{ y: 340 }}
                            bordered
                            sticky
                        />
                        <Pagination
                            style={{ marginTop: 16, textAlign: 'right' }}
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredProjects.length}
                            onChange={(page, pageSize) => {
                                setCurrentPage(page);
                                setPageSize(pageSize);
                            }}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total) => `已选 ${selectedRowKeys.length} / ${total}`}
                        />

                    </Spin>
                </>
            )}
        </Modal>
    )
}


export default BatchAddProject