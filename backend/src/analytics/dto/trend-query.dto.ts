import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';

export class TrendQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  days?: number;

  @IsOptional()
  @IsUUID()
  boardId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 64)
  tz?: string;
}
