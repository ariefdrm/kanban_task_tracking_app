import { Controller, Post, Body, HttpCode, HttpStatus, Ip, Headers, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import type { Response } from 'express';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }


  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body() dto: RegisterDTO,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string
  ) {
    return this.authService.register(dto, userAgent, ip);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res() res: Response,
    @Body() dto: LoginDTO,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string
  ) {
    const { refreshToken, accessToken } = await this.authService.login(dto, userAgent, ip)

    res.cookie('access token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    })

    res.cookie('refresh token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    })

    return {
      data: {
        accessToken,
        refreshToken
      }
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.ACCEPTED)
  refresh(
    @Body() dto: RefreshDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string
  ) {
    return this.authService.refresh(dto.refreshToken, userAgent, ip);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }
}
