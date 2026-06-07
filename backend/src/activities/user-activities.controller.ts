import { Controller, Get, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { ActivitiesService } from './activities.service';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class UserActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) { }

  @Get()
  list(
    @Req() req: Request,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('cursor') cursor?: string,
  ) {
    const userId = (req.user as { id: string }).id
    return this.activitiesService.listForUser(userId, limit ?? 100, cursor)
  }
}
