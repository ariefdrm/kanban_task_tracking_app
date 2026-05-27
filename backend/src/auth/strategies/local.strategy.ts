import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super()
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: { email, password }
    })

    if (!user) {
      throw new UnauthorizedException()
    }

    return user

  }
}
