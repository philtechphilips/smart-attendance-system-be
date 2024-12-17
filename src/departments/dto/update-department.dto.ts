import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateDepartmentDto {
  @ApiProperty()
  @IsString()
  name?: string;
}
