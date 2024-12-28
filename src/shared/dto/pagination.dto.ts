import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: 'Page number for pagination', example: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  currentPage?: number;

  @ApiProperty({ description: 'Page number for pagination', example: 10 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  pageSize?: number;
}
