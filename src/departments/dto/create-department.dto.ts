import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Computer Engineering' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '341' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  schoolId: string;
}
