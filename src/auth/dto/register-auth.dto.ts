import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Transform, Type } from "class-transformer";

export class RegisterAuthDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    password: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    fullName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Transform(({ value }) => value || false)
    isVerified: boolean = false;

    @Type(() => Date)
    createdAt: Date;

    @Type(() => Date)
    updatedAt: Date;
}
