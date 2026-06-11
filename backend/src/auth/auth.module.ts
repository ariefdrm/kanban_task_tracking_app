import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { googleOAuthConstants, jwtContants } from './contants';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

// Only register the Google strategy when credentials are configured. Without
// this, passport-oauth2 throws "requires a clientID option" and crashes the
// whole app at boot — Google OAuth is optional, so it should just be disabled.
const googleStrategyProvider = {
  provide: GoogleStrategy,
  useFactory: (authService: AuthService) => {
    if (!googleOAuthConstants.clientId || !googleOAuthConstants.clientSecret) {
      new Logger(AuthModule.name).warn(
        'GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — Google OAuth (/auth/google) is disabled',
      );
      return null;
    }
    return new GoogleStrategy(authService);
  },
  inject: [AuthService],
};

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.register({
      secret: jwtContants.secret,
      signOptions: { expiresIn: jwtContants.accessTokenTtl }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, LocalStrategy, JwtStrategy, googleStrategyProvider],
})
export class AuthModule { }
