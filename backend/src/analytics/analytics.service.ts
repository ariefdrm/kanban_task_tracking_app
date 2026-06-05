import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) { }

  async summary(userId: string, boardId?: string) {
    const boardFilter = await this.resolveBoardFilter(userId, boardId)

    const [totalBoards, totalTasks, completedTasks] = await Promise.all([
      this.prisma.board.count({ where: { userId } }),
      this.prisma.task.count({
        where: { column: { board: boardFilter } },
      }),
      this.prisma.task.count({
        where: {
          column: { type: 'DONE', board: boardFilter },
        },
      }),
    ])

    const completionRate = totalTasks === 0 ? 0 : completedTasks / totalTasks

    return {
      totalBoards,
      totalTasks,
      completedTasks,
      completionRate: Number(completionRate.toFixed(4)),
    }
  }

  async trend(userId: string, days = 14, boardId?: string) {
    const boardFilter = await this.resolveBoardFilter(userId, boardId)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(today)
    start.setDate(start.getDate() - (days - 1))

    const tasks = await this.prisma.task.findMany({
      where: {
        column: { type: 'DONE', board: boardFilter },
        updatedAt: { gte: start },
      },
      select: { updatedAt: true },
    })

    const buckets = new Map<string, number>()
    for (let i = 0; i < days; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      buckets.set(d.toISOString().slice(0, 10), 0)
    }

    for (const t of tasks) {
      const key = t.updatedAt.toISOString().slice(0, 10)
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }

    return Array.from(buckets.entries()).map(([date, completed]) => ({ date, completed }))
  }

  private async resolveBoardFilter(userId: string, boardId?: string) {
    if (!boardId) return { userId }

    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: { userId: true },
    })
    if (!board) throw new NotFoundException('Board not found')
    if (board.userId !== userId) throw new ForbiddenException('Forbidden')
    return { id: boardId, userId }
  }
}
