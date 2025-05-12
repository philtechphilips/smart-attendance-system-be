import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The name of the course',
    example: 'Introduction to Programming',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The code of the course',
    example: 'CS101',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'The unit of the course',
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  unit?: number;

  @ApiProperty({
    description: 'The UUID of the lecturer assigned to the course',
    example: 'b1f8e7e6-3c65-472b-9c10-312cb8c3dcf7',
  })
  @IsNotEmpty()
  @IsUUID()
  lecturerId: string;

  @ApiProperty({
    description: 'The UUID of the level/class for the course',
    example: '63a9f2b5-5d3e-4f69-b8d1-1e234d123e4f',
  })
  @IsNotEmpty()
  @IsUUID()
  classId: string;

  @ApiProperty({
    description: 'The UUID of the department offering the course',
    example: 'a3f9b8d4-1e23-4d69-b8d1-9e123d11fcd1',
  })
  @IsNotEmpty()
  @IsUUID()
  departmentId: string;

  @ApiProperty({
    description: 'The UUID of the program the course belongs to',
    example: 'c2e7a9f4-4e12-4a7f-b1c1-1e32c91b1f3a',
  })
  @IsNotEmpty()
  @IsUUID()
  programId: string;
}
