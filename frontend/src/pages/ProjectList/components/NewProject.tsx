/**
 * 新建/编辑项目弹窗组件
 * 支持表单校验与提交
 */
import React, { useState } from 'react'
import { Modal, Form, Input, Button, message } from 'antd'
import { addProject, updateProject } from '@/api/projectService'
import type { Project } from '@/api/projectService'

interface NewProjectProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  project: Project | null
}

/**
 * 新建或编辑项目表单
 */
const NewProject: React.FC<NewProjectProps> = ({
  visible,
  onCancel,
  onSuccess,
  project
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 弹窗打开时初始化表单
  React.useEffect(() => {
    if (visible && project) {
      form.setFieldsValue(project)
    } else if (visible) {
      form.resetFields()
    }
  }, [visible, project, form])

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      if (project) {
        // 更新项目
        const response = await updateProject(project.id, values)
        if (response.success) {
          message.success(response.message)
        } else {
          message.error(response.error)
          return
        }
      } else {
        // 创建项目
        const response = await addProject(values)
        if (response.success) {
          message.success(response.message)
        } else {
          message.error(response.error)
          return
        }
      }
      onSuccess()
    } catch (error) {
      message.error('操作失败，请重试')
      console.error('操作失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={project ? '编辑项目' : '新建项目'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          提交
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="项目名称"
          rules={[
            { required: true, message: '请输入项目名称' },
            { max: 100, message: '名称不能超过100个字符' }
          ]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          name="description"
          label="项目描述"
          rules={[{ max: 500, message: '描述不能超过500个字符' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="请输入项目描述（可选）"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default NewProject