import 'dotenv/config'

export const jwtContants: { secret: string; accessTokenTtl: string; refreshTokenTtlDays: number } = {
  secret: process.env.JWT_SECRET as string,
  accessTokenTtl: '15m',
  refreshTokenTtlDays: 7,
}
