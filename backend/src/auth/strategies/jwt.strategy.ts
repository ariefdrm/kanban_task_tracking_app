import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import "dotenv/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        let data = null;
        if (req && req.cookies) {
          data = req.cookies['access_token'];
        }
        return data;
      }]),
      ignoreExpiration: false,
      secretOrKey: process.env.jwt_access_secret || 'access-secret',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return user;
  }
}
