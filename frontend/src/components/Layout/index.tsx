import React from 'react'
import { Layout, Menu, Typography } from 'antd'
import { Link } from 'react-router-dom'

const { Header, Content, Footer } = Layout

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              label: <Link to="/">项目管理</Link>,
            },
          ]}
        />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        {children}
      </Content>
      <Footer style={{
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#f0f2f5',
        borderTop: '1px solid #e8e8e8',
      }}>
        <div>
          项目管理系统 ©2025
        </div>
        <Typography.Text type="secondary" style={{ marginTop: 8 }}>
          2025年7月23日下午面试结束后的笔试项目
        </Typography.Text>
      </Footer>
    </Layout>
  )
}

export default AppLayout