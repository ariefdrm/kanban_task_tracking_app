import { IsOptional, IsUUID } from 'class-validator';

export class SummaryQueryDto {
  @IsOptional()
  @IsUUID()
  boardId?: string;
}
