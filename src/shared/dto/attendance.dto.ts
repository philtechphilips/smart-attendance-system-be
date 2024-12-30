import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AttendanceQueryDto {
  @ApiProperty({ description: 'filter by status', example: 'status' })
  @Type(() => String)
  @IsOptional()
  status?: string;
}
