import { Controller, Post, Body, HttpCode, HttpStatus, Ip, Headers, Res, Get, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import type { Request, Response } from 'express';
import { RefreshDto } from './dto/refresh.dto';
import { Cookie } from './decorator/cookie.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered, tokens set as cookies' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDTO,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string
  ) {
    const result = await this.authService.register(dto, userAgent, ip);
    const { accessToken, refreshToken } = result.data.user.tokens;

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and receive tokens' })
  @ApiResponse({ status: 200, description: 'Login successful, tokens returned and set as cookies' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
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
      maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
  @ApiCookieAuth('refresh_token')
  @ApiOperation({ summary: 'Rotate refresh token using refresh_token cookie' })
  @ApiResponse({ status: 202, description: 'New token pair issued' })
  @ApiResponse({ status: 401, description: 'Missing or invalid refresh token' })
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
      maxAge: 15 * 60 * 1000,
    })

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
  @ApiCookieAuth('refresh_token')
  @ApiOperation({ summary: 'Log out and clear auth cookies' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @Cookie('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.logout(refreshToken)

    const cookieOptions = { httpOnly: true, sameSite: 'lax' as const, path: '/' }
    res.clearCookie('access_token', cookieOptions)
    res.clearCookie('refresh_token', cookieOptions)

    return result
  }

  @Get('me')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Get current user from access_token cookie' })
  @ApiResponse({ status: 200, description: 'Current user data' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  me(
    @Cookie('access_token') accessToken: string
  ) {
    return this.authService.me(accessToken)
  }
}
