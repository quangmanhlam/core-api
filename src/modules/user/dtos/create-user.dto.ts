import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsEmail, IsEnum, IsOptional, IsString, MinLength} from "class-validator";

import {STATUS, STATUS_LIST, TYPES, TYPES_LIST} from "../constants";

export class CreateUserDto {
    @ApiProperty({
        description: "Name",
        required: true
    })
    @IsDefined()
    @IsString()
    name: string;

    @ApiProperty({
        description: "email",
        required: true
    })
    @IsDefined()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "phone",
        required: true
    })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({
        description: "password",
        required: true
    })
    @IsDefined()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        description: "roleId",
        required: true
    })
    @IsDefined()
    @IsString()
    roleId: string;

    @ApiProperty({
        description: "status",
        required: true,
        enum: STATUS_LIST
    })
    @IsDefined()
    @IsEnum(STATUS)
    status: string;
}
