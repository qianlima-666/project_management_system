/**
 * 日志路由定义
 * 提供日志查询和统计相关的 API 路由
 */
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { LogService } from '../services/log.service'
import { LogQuerySchema } from '../validators/log.validator'

const logs = new Hono()

// 获取操作日志
logs.get('/', zValidator('query', LogQuerySchema), async (c) => {
    try {
        const query = c.req.valid('query')
        const result = await LogService.findMany(query)
        return c.json(result)
    } catch (error) {
        console.error('获取日志时出错:', error)
        return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
})

// 获取操作统计
logs.get('/stats', async (c) => {
    try {
        const result = await LogService.getStats()
        return c.json(result)
    } catch (error) {
        console.error('获取日志统计时出错:', error)
        return c.json({ success: false, error: '服务器内部错误' }, 500)
    }
})

export default logs