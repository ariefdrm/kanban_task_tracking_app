import { Controller, Get, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { ActivitiesService } from './activities.service';

@Controller('boards/:boardId/activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) { }

  @Get()
  list(
    @Req() req: Request,
    @Param('boardId', ParseUUIDPipe) boardId: string,
  ) {
    const userId = (req.user as { id: string }).id
    return this.activitiesService.listForBoard(userId, boardId)
  }
}
