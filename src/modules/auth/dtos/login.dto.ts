import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, IsEmail } from "class-validator";

export class LoginDto {
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
    password: string;
}
