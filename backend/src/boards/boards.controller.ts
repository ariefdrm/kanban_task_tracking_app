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
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) { }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateBoardDto) {
    return this.boardsService.create(this.userId(req), dto)
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.boardsService.findAllForUser(this.userId(req))
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.boardsService.findOneForUser(this.userId(req), id)
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardsService.update(this.userId(req), id, dto)
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.boardsService.remove(this.userId(req), id)
  }

  private userId(req: Request) {
    return (req.user as { id: string }).id
  }
}
