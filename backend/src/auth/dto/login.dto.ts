import { PartialType } from '@nestjs/mapped-types';
import { RegisterDTO } from './register.dto';
import { IsEmail, IsString } from 'class-validator';

export class LoginDTO extends PartialType(RegisterDTO) {
  @IsEmail()
  email?: string | undefined;

  @IsString()
  password?: string | undefined;

}
