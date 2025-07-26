import { createClient } from 'redis'

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


redisClient.connect().then(() => {
  console.log('✅ Redis 连接成功');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis 连接错误:', err);
});

export default redisClient