import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ColumnType } from '../../generated/prisma/enums';

export class UpdateColumnDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

  @IsOptional()
  @IsEnum(ColumnType)
  type?: ColumnType;
}
