# 项目管理系统 Docker Compose 使用指南

本指南介绍如何使用 Docker Compose 一键部署本项目的前端、后端、数据库和 Redis 服务。

## 目录结构

- `./frontend`：存放**打包后的前端文件**（如 `dist` 目录下内容），会挂载到 Nginx 容器的 `/usr/share/nginx/html`。
- `./backend`：存放**打包后的后端文件**（如 Node.js 项目的编译产物），会挂载到后端容器的 `/app`。

## 快速开始

1. **准备前端和后端打包文件**
   - 前端：打包后将 `dist` 目录内容复制到 `./frontend`。
   - 后端：打包后将 `index.js` 及依赖复制到 `./backend`。

2. **创建 .env 文件并设置环境变量**
   
   在 `.docker-compose` 目录下新建 `.env` 文件，可设置如下内容：

   ```
   FRONTEND_DOMAIN=example.com
   FRONTEND_DOMAIN="example.com"
   ```
   或者，支持多个域名：

   ```
   ["example.com", "example2.com"]
   ```

   - `FRONTEND_DOMAIN` 可以为字符串（单个域名）或数组（多个域名）。
   - 该变量可用于 Nginx 配置、后端服务跨域等场景。

3. **启动服务**
   在 `.docker-compose` 目录下执行：
   ```sh
   docker-compose up -d
   ```

4. **服务说明**
   - **前端服务**：Nginx，监听 80 端口，静态资源来自 `./frontend`。
   - **后端服务**：Node.js，监听 3001 端口，代码来自 `./backend`。
   - **数据库服务**：PostgreSQL，数据持久化到 `./db`。
   - **Redis 服务**：配置和数据持久化到 `./redis`。

5. **关闭服务**
   ```sh
   docker-compose down
   ```

## 常见问题与注意事项

- 启动前请确保 `./frontend` 和 `./backend` 目录已存在且内容完整。
- 如需修改端口、环境变量等，请编辑 `docker-compose.yml` 或 `.env` 文件。
- 日志与数据均持久化在本地目录，便于调试和数据备份。

## 参考

- [docker-compose.yml 配置说明](./docker-compose.yml)
- 前端、后端详细说明请见各自目录下的 `README.md`
