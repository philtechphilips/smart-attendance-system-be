import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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

  @IsEmail()
  @IsNotEmpty()
  email: string;

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
