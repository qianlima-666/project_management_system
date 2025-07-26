/**
 * 应用配置管理
 * 
 * 集中管理应用的所有配置项
 * 从环境变量读取配置，提供默认值
 * 包括服务器端口、数据库连接、Redis 配置、CORS 设置等
 * 支持前端域名的灵活配置（单个或多个域名）
 */
import dotenv from 'dotenv'

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
  nodeEnv: process.env.NODE_ENV || 'development',
}

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

export default config