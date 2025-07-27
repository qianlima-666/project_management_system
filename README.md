# 项目管理系统

本项目为全栈项目管理系统，包含前端与后端，采用现代主流技术栈开发，支持本地开发、Docker 部署与 构建产物 运行。


## 🌟 技术架构
| 层级        | 技术选型                          |
|-------------|----------------------------------|
| **前端**    | React 18 + TypeScript + Vite     |
| **后端**    | Hono.js + TypeScript             |
| **ORM**     | Prisma                          |
| **数据库**  | PostgreSQL                       |
| **缓存**    | Redis                           |
| **API规范** | OpenAPI/Swagger                 |


## 目录结构

```
backend/           # 后端服务
frontend/          # 前端应用
.docker-compose/   # Docker Compose 配置
```

---

## 🚀 快速部署

### 1. Docker Compose （生产推荐）

1. 下载对应平台的 构建产物 ，并解压到任意目录。
2. 将 `.docker-compose` 目录内的 `docker-compose.yml` 文件复制到与 `frontend` 和 `backend` 同一目录下。
3. 在 `docker-compose.yml` 文件同一目录下新建 `.env` 文件，或直接在 `docker-compose.yml` 的 `backend` 服务 `environment` 字段中添加：

   ```
   FRONTEND_DOMAIN=example.com
   ```
   - 支持单个或多个域名（如 `["example.com", "example2.com"]`）。

4. 在 `docker-compose.yml` 所在目录下执行：

   ```sh
   docker-compose up -d
   ```

5. 访问前端和后端服务，具体端口和说明见 [.docker-compose/README.md](.docker-compose/README.md)。

### 2. 构建产物运行

1. 在[下载说明](./Download_instructions.md)中选择并下载适合你操作系统的 构建产物 （本项目构建产物为 Node.js 产物，需本地已安装 Node.js 环境）。
   - 推荐 Node.js 版本：**22.17.1**。
2. 解压后，将前端文件放到 Web 服务器中，并配置好域名。后端使用 `node index.js` 命令启动。
3. **需要本地已安装 PostgreSQL 和 Redis 服务，并已启动。**
4. 按需配置环境变量（如 `FRONTEND_DOMAIN`）。
5. 如果前后端分离，请将前端文件夹内 `static\js\core-services.yFFQt3y1.js` 中的 `/api` 替换为后端url(如：`https://api.example.com/api`)。

---

## 🔧 开发指南（源码运行）

1. 需本地安装 **Node.js 22.17.1**、**PostgreSQL**、**Redis**。
2. 克隆本仓库：
   ```sh
   git clone https://github.com/your-repo/project_management_system.git
   cd project_management_system
   ```
3. 分别进入 `backend` 和 `frontend` 目录，安装依赖并启动服务：
   ```sh
   cd backend
   npm install
   # 如需数据库，初始化数据库
   npx prisma migrate dev
   npm run dev
   ```
   另开一个终端窗口，执行：
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
4. 默认前端运行在 `http://localhost:5173`，后端运行在 `http://localhost:3000`（端口可在各自配置中修改）。
5. 如需自定义环境变量，可在各自目录下新建 `.env` 文件。
