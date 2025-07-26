# 项目管理系统后端

基于 **Node.js 22**、**TypeScript** 和 **Prisma**，提供项目管理相关 RESTful API。

## 技术栈

- Node.js 22
- TypeScript
- Prisma ORM
- esbuild
- dotenv

## 目录结构

```
backend/
├── prisma/            # Prisma 配置与数据库迁移
├── src/               # 源码目录
├── .env               # 环境变量
├── package.json       # 依赖与脚本
└── README.md
```

## 快速开始

1. 安装依赖

    ```sh
    npm install
    ```

2. 配置环境变量

    ```sh
    cp .env.example .env
    ```

3. 数据库迁移

    ```sh
    npx prisma migrate dev
    ```

4. 启动开发环境

    ```sh
    npm run dev
    ```

    默认地址：http://localhost:3001/api

5. 生产构建

    ```sh
    npm run build
    ```

6. 启动生产环境

    ```sh
    npm start
    ```

## 主要功能

- 项目增删改查 RESTful API
- 批量导入、批量删除
- Prisma ORM 数据库操作
- 环境变量灵活配置
- 统一错误处理与日志输出

## 环境变量

- `DATABASE_URL`：数据库连接地址
- `PORT`：服务端口（默认 3001）

## 其他说明

- 推荐使用 [Prisma Studio](https://www.prisma.io/studio)：`npx prisma studio`
- 前端默认对接地址：`http://localhost:3001/api`
- 代码风格遵循 ESLint 推荐规范

---
