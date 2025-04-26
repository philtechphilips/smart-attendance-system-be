import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  firstname: string;

  @IsString()
  @Optional()
  @Length(1, 255)
  middlename?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Optional()
  role?: string;

  @Transform(({ value }) => value || false)
  isVerified?: boolean = false;

  @Type(() => Date)
  createdAt?: Date;

  @Type(() => Date)
  updatedAt?: Date;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
