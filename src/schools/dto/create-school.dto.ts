import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchoolDto {
  @ApiProperty({ description: 'Engineering' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
