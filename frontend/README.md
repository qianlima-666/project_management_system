# 项目管理系统前端

基于 React + Ant Design + Vite，支持项目的增删改查、批量导入、批量删除等功能。

## 技术栈

- React 18
- Ant Design 5
- Vite 7
- TypeScript 5
- React Router 7
- TanStack React Query
- Axios
- xlsx (Excel 解析)

## 目录结构

```
frontend/
├── public/                  # 公共资源
├── src/                     # 源码目录
│   ├── api/                 # API 请求封装
│   ├── components/          # 全局通用组件
│   ├── pages/               # 页面级组件
│   ├── types/               # TypeScript 类型定义
│   └── main.tsx             # 应用入口
├── index.html               # HTML 模板
├── package.json             # 依赖与脚本
├── vite.config.ts           # Vite 配置
└── tsconfig*.json           # TypeScript 配置
```

## 快速开始

1. 安装依赖

    ```sh
    npm install
    ```

2. 启动开发环境

    ```sh
    npm run dev
    ```

    默认访问地址：http://localhost:5173

3. 打包构建

    ```sh
    npm run build
    ```

    构建产物输出到 `build/` 目录。

4. 预览构建产物

    ```sh
    npm run preview
    ```

## 环境变量

- `VITE_API_BASE_URL`：后端 API 基础地址（可在 `.env` 文件中配置）

## 主要功能

- 项目列表分页展示、搜索
- 新建、编辑、删除项目
- 批量导入项目（支持 Excel 文件）
- 批量删除、清空所有项目
- 响应式布局，适配主流浏览器

## 其他说明

- 需配合后端接口使用，默认后端