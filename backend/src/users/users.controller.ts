import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  me(@Req() req: Request) {
    return this.usersService.findById(this.userId(req))
  }

  @Patch('me')
  update(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(this.userId(req), dto)
  }

  @Post('me/password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(this.userId(req), dto)
  }

  private userId(req: Request) {
    return (req.user as { id: string }).id
  }
}
