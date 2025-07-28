/**
 * Redis 连接管理
 * 
 * 配置和管理 Redis 客户端连接
 * 包含重连策略和错误处理机制
 * 提供可靠的缓存服务基础设施
 * 支持连接状态监控和自动重连
 */
import { createClient } from 'redis'

// Redis 客户端配置
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    // 重试间隔时间
    reconnectStrategy: (retries) => {
      // 每次重试的间隔时间
      const delay = Math.min(retries * 1000, 5000);
      console.log(`🔄 正在尝试重新连接到 Redis... (第 ${retries} 次重试，延迟 ${delay}ms)`);
      return delay;
    },
  },
});

// 连接 Redis 客户端
redisClient.connect().then(() => {
  console.log('✅ Redis 连接成功');
});

// 监听连接错误
redisClient.on('error', (err) => {
  console.error('❌ Redis 连接错误:', err);
});

export default redisClient