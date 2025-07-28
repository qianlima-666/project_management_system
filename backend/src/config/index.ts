/**
 * 应用配置管理
 * 
 * 集中管理应用的所有配置项
 * 从环境变量读取配置，提供默认值
 * 包括服务器端口、数据库连接、Redis 配置、CORS 设置等
 * 支持前端域名的灵活配置（单个或多个域名）
 */
import dotenv from 'dotenv'
import { parse } from 'path'

dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3001'),
  database: {
    url: process.env.DATABASE_URL!,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  cors: {
    origin: parseFrontendDomain(process.env.FRONTEND_DOMAIN),
  },
  excludeProjectNames: parseExcludeProjectNames(process.env.EXCLUDE_PROJECT_NAMES)
}

// 解析前端域名配置
function parseFrontendDomain(domain?: string): string[] {
  if (!domain) {
    console.warn("⚠️ 未配置 FRONTEND_DOMAIN，使用默认值 http://localhost:5173")
    return ["http://localhost:5173"]
  }

  try {
    if (domain.startsWith('[') && domain.endsWith(']')) {
      return JSON.parse(domain)
    } else {
      return [domain]
    }
  } catch (error) {
    console.error("⚠️ 前端域名解析失败，使用默认值 http://localhost:5173 ")
    return ["http://localhost:5173"]
  }
}

// 解析排除的项目名称
function parseExcludeProjectNames(names?: string): string[] {
  if (!names) {
    console.warn("⚠️ 未配置 EXCLUDE_PROJECT_NAMES，使用默认值 []")
    return []
  }

  try {
    if (names.startsWith('[') && names.endsWith(']')) {
      return JSON.parse(names)
    } else {
      return [names]
    }
  } catch (error) {
    console.error("⚠️ 排除项目名称解析失败，使用默认值 [] ")
    return []
  }
}
export default config