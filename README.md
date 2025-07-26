# 项目管理系统

本项目为全栈项目管理系统，包含前端与后端，采用现代主流技术栈开发，支持本地开发与 Docker 部署。

## 目录结构

```
backend/    # 后端服务（Node.js + TypeScript + Prisma）
frontend/   # 前端应用（React + TypeScript + Vite）
.docker-compose/  # Docker Compose 配置
```

## Docker Compose 部署

更多配置请参考 [.docker-compose/](.docker-compose/) 目录下的相关文件。

## 前端

- 技术栈：React 18, TypeScript, Vite, Ant Design, React Router, Axios, TanStack React Query, XLSX
- 入口文件：[frontend/index.html](frontend/index.html)

### 启动开发环境

```sh
cd frontend
npm install
npm run dev
```

### 生产构建

```sh
npm run build
```

## 后端

- 技术栈：Node.js 22, TypeScript, Prisma, esbuild
- Prisma 配置：[backend/prisma/schema.prisma](backend/prisma/schema.prisma)

### 启动开发环境

```sh
cd backend
npm install
npm run dev
```

### 生产构建

```sh
npm run build
```

## 历史版本

- 旧版前端（Create React App + CRACO）：[.old/frontend-node_20.14_create_PackagingFailed/](.old/frontend-node_20.14_create_PackagingFailed/)
- 旧版后端：[.old/backend-node_20.14_esbuild/](.old/backend-node_20.14_esbuild/)