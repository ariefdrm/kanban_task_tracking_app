import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activities: ActivitiesService,
  ) { }

  async create(userId: string, dto: CreateTaskDto) {
    const column = await this.loadOwnedColumn(userId, dto.columnId)

    const task = await this.prisma.$transaction(async (tx) => {
      const count = await tx.task.count({ where: { columnId: column.id } })
      return tx.task.create({
        data: {
          columnId: column.id,
          title: dto.title,
          description: dto.description,
          priority: dto.priority ?? 'MEDIUM',
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          position: count,
        },
      })
    })

    await this.activities.log({
      boardId: column.boardId,
      action: 'TASK_CREATED',
      taskId: task.id,
      metadata: { columnId: column.id, title: task.title },
    })

    return task
  }

  async findOne(userId: string, taskId: string) {
    const task = await this.loadOwnedTask(userId, taskId)
    return task
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.loadOwnedTask(userId, taskId)

    const data: Record<string, unknown> = {}
    if (dto.title !== undefined) data.title = dto.title
    if (dto.description !== undefined) data.description = dto.description
    if (dto.priority !== undefined) data.priority = dto.priority
    if (dto.dueDate !== undefined) data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data,
    })

    await this.activities.log({
      boardId: task.column.boardId,
      action: 'TASK_UPDATED',
      taskId,
      metadata: { changes: data },
    })

    return updated
  }

  async remove(userId: string, taskId: string) {
    const task = await this.loadOwnedTask(userId, taskId)

    await this.prisma.$transaction(async (tx) => {
      await tx.task.delete({ where: { id: taskId } })
      await tx.task.updateMany({
        where: { columnId: task.columnId, position: { gt: task.position } },
        data: { position: { decrement: 1 } },
      })
    })

    await this.activities.log({
      boardId: task.column.boardId,
      action: 'TASK_DELETED',
      taskId: null,
      metadata: { taskId, columnId: task.columnId, title: task.title },
    })

    return { id: taskId, deleted: true }
  }

  async reorder(userId: string, taskId: string, target: number) {
    const task = await this.loadOwnedTask(userId, taskId)

    const result = await this.prisma.$transaction(async (tx) => {
      const total = await tx.task.count({ where: { columnId: task.columnId } })
      const clamped = Math.min(Math.max(target, 0), total - 1)
      if (clamped === task.position) return task

      if (clamped > task.position) {
        await tx.task.updateMany({
          where: {
            columnId: task.columnId,
            position: { gt: task.position, lte: clamped },
          },
          data: { position: { decrement: 1 } },
        })
      } else {
        await tx.task.updateMany({
          where: {
            columnId: task.columnId,
            position: { gte: clamped, lt: task.position },
          },
          data: { position: { increment: 1 } },
        })
      }

      return tx.task.update({
        where: { id: taskId },
        data: { position: clamped },
      })
    })

    if (result.position !== task.position) {
      await this.activities.log({
        boardId: task.column.boardId,
        action: 'TASK_REORDERED',
        taskId,
        metadata: {
          columnId: task.columnId,
          fromPosition: task.position,
          toPosition: result.position,
        },
      })
    }

    return result
  }

  async move(userId: string, taskId: string, dto: MoveTaskDto) {
    const task = await this.loadOwnedTask(userId, taskId)

    if (dto.targetColumnId === task.columnId) {
      return this.reorder(userId, taskId, dto.position)
    }

    const target = await this.loadOwnedColumn(userId, dto.targetColumnId)
    if (target.boardId !== task.column.boardId) {
      throw new BadRequestException('Cannot move task to a column on another board')
    }

    const moved = await this.prisma.$transaction(async (tx) => {
      await tx.task.updateMany({
        where: { columnId: task.columnId, position: { gt: task.position } },
        data: { position: { decrement: 1 } },
      })

      const targetCount = await tx.task.count({ where: { columnId: target.id } })
      const clamped = Math.min(Math.max(dto.position, 0), targetCount)

      await tx.task.updateMany({
        where: { columnId: target.id, position: { gte: clamped } },
        data: { position: { increment: 1 } },
      })

      return tx.task.update({
        where: { id: taskId },
        data: { columnId: target.id, position: clamped },
      })
    })

    await this.activities.log({
      boardId: task.column.boardId,
      action: 'TASK_MOVED',
      taskId,
      metadata: {
        fromColumnId: task.columnId,
        toColumnId: target.id,
        fromPosition: task.position,
        toPosition: moved.position,
      },
    })

    return moved
  }

  private async loadOwnedTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { column: { select: { id: true, boardId: true, board: { select: { userId: true } } } } },
    })
    if (!task) throw new NotFoundException('Task not found')
    if (task.column.board.userId !== userId) throw new ForbiddenException('Forbidden')
    return task
  }

  private async loadOwnedColumn(userId: string, columnId: string) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { board: { select: { userId: true } } },
    })
    if (!column) throw new NotFoundException('Column not found')
    if (column.board.userId !== userId) throw new ForbiddenException('Forbidden')
    return column
  }
}
