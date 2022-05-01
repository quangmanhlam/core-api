import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsEmail, IsEnum, IsObject, IsOptional, IsString, MinLength} from "class-validator";

import {STATUS, STATUS_LIST} from "../constants";

export class UpdateUserDto {
    @ApiProperty({
        description: "Name",
        required: true
    })
    @IsDefined()
    @IsString()
    name: string;

    @ApiProperty({
        description: "email",
        required: true,
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
        description: "Enter password if you want update",
        required: false
    })
    @IsOptional()
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

    @ApiProperty({
        description: "settings",
        required: false,
    })
    @IsOptional()
    @IsObject()
    settings: any;
}
