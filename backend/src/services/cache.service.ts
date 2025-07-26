/**
 * 缓存服务层
 * 
 * 基于 Redis 的缓存管理服务
 * 提供通用的缓存操作：存储、读取、删除、模式匹配删除
 * 支持自动 JSON 序列化/反序列化
 * 用于提升应用性能，减少数据库查询压力
 */
import { redisClient } from '../lib/redis'

export class CacheService {
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key] || ''}`)
      .join(':')
    return `${prefix}:${sortedParams}`
  }
  
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redisClient.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('缓存读取失败:', error)
      return null
    }
  }
  
  static async set(key: string, value: any, ttl: number = 60): Promise<void> {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('缓存写入失败:', error)
    }
  }
  
  static async del(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern)
      if (keys.length > 0) {
        await redisClient.del(keys)
      }
    } catch (error) {
      console.error('缓存删除失败:', error)
    }
  }
  
  static async invalidatePattern(pattern: string): Promise<void> {
    await this.del(pattern)
  }
}