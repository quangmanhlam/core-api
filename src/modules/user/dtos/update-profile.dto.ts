import {ApiProperty} from "@nestjs/swagger";
import {IsDefined, IsObject, IsOptional, IsString} from "class-validator";

export class UpdateProfileDto {
    @ApiProperty({
        description: "Name",
        required: true
    })
    @IsDefined()
    @IsString()
    name: string;

    @ApiProperty({
        description: "phone",
        required: false
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
    password: string;

    @ApiProperty({
        description: "settings",
        required: false,
    })
    @IsOptional()
    @IsObject()
    settings: any;

}
