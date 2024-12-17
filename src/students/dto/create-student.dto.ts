import { IsString, IsDate, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Michael' })
  @IsNotEmpty()
  @IsString()
  middlename: string;

  @ApiProperty({ example: 'MAT123456' })
  @IsNotEmpty()
  @IsString()
  matricNo: string;

  @ApiProperty({ example: '2000-05-15' })
  @IsNotEmpty()
  @IsDate()
  dob: Date;

  @ApiProperty({ example: 'Nigeria' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({ example: 'Lagos' })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 'Ikeja' })
  @IsNotEmpty()
  @IsString()
  lga: string;

  @ApiProperty({ example: '300-Level' })
  @IsNotEmpty()
  @IsString()
  class: string;

  @ApiProperty({ example: '+2349012345678' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: '123 Main Street, Victoria Island' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Mr. James' })
  @IsNotEmpty()
  @IsString()
  guardian: string;

  @ApiProperty({ example: '456 Guardian Avenue, Lagos' })
  @IsNotEmpty()
  @IsString()
  guardianAddress: string;

  @ApiProperty({ example: '+2348023456789' })
  @IsNotEmpty()
  @IsString()
  guardianPhone: string;

  @ApiProperty({ example: '1e23d456-789f-12ab-34cd-56ef7890' })
  @IsNotEmpty()
  @IsString()
  levelId: string;

  @ApiProperty({ example: 'school-12345' })
  @IsNotEmpty()
  @IsString()
  schoolId: string;

  @ApiProperty({ example: 'dept-56789' })
  @IsNotEmpty()
  @IsString()
  departmentId: string;
}
