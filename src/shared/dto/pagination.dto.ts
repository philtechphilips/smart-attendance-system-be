import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  currentPage: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  pageSize: number;
}
