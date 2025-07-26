/**
 * 缓存服务层
 * 基于 Redis 的缓存管理，支持通用缓存操作
 */
import { redisClient } from '../lib/redis'

export class CacheService {
  // 生成缓存 key
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key] || ''}`)
      .join(':')
    return `${prefix}:${sortedParams}`
  }

  // 获取缓存
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redisClient.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('缓存读取失败:', error)
      return null
    }
  }

  // 设置缓存
  static async set(key: string, value: any, ttl: number = 60): Promise<void> {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('缓存写入失败:', error)
    }
  }

  // 删除缓存（支持模式）
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

  // 按模式失效缓存
  static async invalidatePattern(pattern: string): Promise<void> {
    await this.del(pattern)
  }
}