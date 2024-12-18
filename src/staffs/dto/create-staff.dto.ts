import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({
    description: 'Middle name of the staff',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  middlename: string;

  @ApiProperty({
    description: 'First name of the staff',
    example: 'Jane',
  })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'Last name of the staff',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Email address of the staff',
    example: 'jane.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the staff',
    example: '+1234567890',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Residential address of the staff',
    example: '123 Main St, Anytown, AT 12345',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Position of the staff in the organization',
    example: 'Lecturer',
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    description: 'Level of the staff in the organization',
    example: 'Senior',
  })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({
    description: 'Date of birth of the staff',
    example: '1990-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dob: Date;

  @ApiProperty({
    description: 'UUID of the department the staff belongs to',
    example: '161c7ce4-a98e-4f16-b5a8-e37fd4114089',
  })
  @IsUUID()
  @IsNotEmpty()
  departmentId: string;
}
