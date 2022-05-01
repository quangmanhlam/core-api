import { ApiProperty } from "@nestjs/swagger";
import {IsDefined, IsString, IsEmail, MinLength, MaxLength, IsOptional} from "class-validator";

export class RegisterDto {
    @ApiProperty({
        description: "email",
        required: true
    })
    @IsDefined()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Password",
        required: true
    })
    @IsDefined()
    @IsString()
    @MinLength(5)
    @MaxLength(40)
    password: string;

    @ApiProperty({
        description: "name",
        required: true
    })
    @IsDefined()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        description: "photo",
        required: false
    })
    @IsOptional()
    @IsString()
    photo: string;

    @ApiProperty({
        description: "phone",
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(9)
    @MaxLength(11)
    phone: string;
}
