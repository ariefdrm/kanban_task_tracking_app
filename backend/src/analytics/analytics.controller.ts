import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { SummaryQueryDto } from './dto/summary-query.dto';
import { TrendQueryDto } from './dto/trend-query.dto';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('summary')
  summary(@Req() req: Request, @Query() query: SummaryQueryDto) {
    return this.analyticsService.summary(this.userId(req), query.boardId)
  }

  @Get('trend')
  trend(@Req() req: Request, @Query() query: TrendQueryDto) {
    return this.analyticsService.trend(
      this.userId(req),
      query.days ?? 14,
      query.boardId,
      query.tz,
    )
  }

  @Get('distribution')
  distribution(@Req() req: Request, @Query() query: SummaryQueryDto) {
    return this.analyticsService.distribution(this.userId(req), query.boardId)
  }

  private userId(req: Request) {
    return (req.user as { id: string }).id
  }
}
