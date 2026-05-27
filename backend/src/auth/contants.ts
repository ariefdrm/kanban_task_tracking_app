import 'dotenv/config'

export const jwtContants: { secret: string } = {
  secret: process.env.SECRET as string
}
