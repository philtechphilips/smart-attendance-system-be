import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AttendanceQueryDto {
  @ApiProperty({ description: 'filter by status', example: 'present' })
  @Type(() => String)
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'filter by level', example: 'ND 1' })
  @Type(() => String)
  @IsOptional()
  level?: string;
}
