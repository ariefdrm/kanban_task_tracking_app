import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTaskDto) {
    return this.taskService.create(this.userId(req), dto)
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.findOne(this.userId(req), id)
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(this.userId(req), id, dto)
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.taskService.remove(this.userId(req), id)
  }

  @Post(':id/move')
  move(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: MoveTaskDto,
  ) {
    return this.taskService.move(this.userId(req), id, dto)
  }

  @Post(':id/reorder')
  reorder(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReorderTaskDto,
  ) {
    return this.taskService.reorder(this.userId(req), id, dto.position)
  }

  private userId(req: Request) {
    return (req.user as { id: string }).id
  }
}
