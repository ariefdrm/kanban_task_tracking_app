import { IsEnum, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { ColumnType } from '../../generated/prisma/enums';

export class CreateColumnDto {
  @IsUUID()
  boardId: string;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsOptional()
  @IsEnum(ColumnType)
  type?: ColumnType;
}
