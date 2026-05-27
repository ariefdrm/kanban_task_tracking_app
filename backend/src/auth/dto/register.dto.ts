import { IsEmail, IsString, Length, Matches } from "class-validator";

export class RegisterDTO {
  @IsString()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Name can only contain letters, numbers, and underscores',
  })
  name: string

  @IsEmail()
  email: string

  @IsString()
  password: string
}
