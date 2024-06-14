import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateAuthDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    password: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    email: string;
}
