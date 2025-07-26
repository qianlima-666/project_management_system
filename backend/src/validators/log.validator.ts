import { z } from 'zod'

// 日志查询参数验证规则
export const LogQuerySchema = z.object({
    // 分页参数 默认为 1
    page: z.string().transform((val) => {
        const num = Number(val)
        return isNaN(num) || num < 1 ? 1 : num
    }).default(1),
    // 每页记录数 默认为 10，最大 100
    limit: z.string().transform((val) => {
        const num = Number(val)
        return isNaN(num) || num < 1 ? 10 : Math.min(num, 100)
    }).default(10),
    // 操作类型过滤器
    operation: z.string().optional(),
    // 表名过滤
    tableName: z.string().optional(),
    // 时间范围过滤 开始时间
    startDate: z.string().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: '时间格式错误' }
    ).optional(),
    // 时间范围过滤 结束时间
    endDate: z.string().refine(
        (val) => !val || !isNaN(Date.parse(val)),
        { message: '时间格式错误' }
    ).optional(),
})