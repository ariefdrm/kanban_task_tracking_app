import 'dotenv/config'

export const jwtContants = {
  secret: process.env.JWT_SECRET as string,
  accessTokenTtl: '15m',
  refreshTokenTtl: '7d',
  refreshTokenTtlMs: 7 * 24 * 60 * 60 * 1000,
} as const
