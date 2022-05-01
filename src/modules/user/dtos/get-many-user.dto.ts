import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsEnum } from "class-validator";

import { ValidateDto } from "../../../dtos";
import { FILTER_FIELDS, SORT_FIELDS, STATUS, STATUS_LIST, IS_ARCHIVED, IS_ARCHIVED_LIST } from "../constants";

export class GetManyUserDto extends ValidateDto {
    constructor() {
        super(FILTER_FIELDS, SORT_FIELDS);
    }

    @ApiProperty({
        description: "Search by name",
        required: false
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        description: "Search by role id",
        required: false
    })
    @IsOptional()
    @IsString()
    roleId: string;

    @ApiProperty({
        description: "Search by email",
        required: false
    })
    @IsOptional()
    @IsString()
    email: string;

    @ApiProperty({
        description: "Search by phone",
        required: false
    })
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty({
        description: "Search by status",
        required: false,
    })
    @IsOptional()
    @IsString()
    status: string;

    @ApiProperty({
        description: "Search by is archived",
        required: false,
        enum: IS_ARCHIVED_LIST
    })
    @IsOptional()
    @IsEnum(IS_ARCHIVED)
    isArchived: string;
}
