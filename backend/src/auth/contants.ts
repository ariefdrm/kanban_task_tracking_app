import 'dotenv/config'

export const jwtContants: { secret: string } = {
  secret: process.env.JWT_SECRET as string
}
