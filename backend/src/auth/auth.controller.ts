import { Controller, Post, Body, HttpCode, HttpStatus, Ip, Headers, Res, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import type { Request, Response } from 'express';
import { RefreshDto } from './dto/refresh.dto';
import { Cookie } from './decorator/cookie.decorator';

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
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDTO,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string
  ) {
    const { refreshToken, accessToken } = await this.authService.login(dto, userAgent, ip)

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    })

    res.cookie('refresh_token', refreshToken, {
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
  async refresh(
    @Cookie('refresh_token') getRefreshToken: string,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string
  ) {
    if (!getRefreshToken) throw new UnauthorizedException('Refresh token missing')

    const { refreshToken, accessToken } = await this.authService.refresh(getRefreshToken, userAgent, ip);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    })

    res.cookie('refresh_token', refreshToken, {
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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Cookie('refresh_token') refreshToken: string) {

    return this.authService.logout(refreshToken);
  }

  @Get('me')
  me(
    @Cookie('access_token') accessToken: string
  ) {
    return this.authService.me(accessToken)
  }
}
