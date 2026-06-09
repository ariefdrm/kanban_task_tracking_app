import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { RegisterDTO } from './register.dto';
import { IsEmail, IsString } from 'class-validator';

export class LoginDTO extends PartialType(RegisterDTO) {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email?: string | undefined;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password?: string | undefined;
}
