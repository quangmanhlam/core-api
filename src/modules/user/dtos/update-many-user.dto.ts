import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsDefined} from "class-validator";

import {ValidateDto} from '../../../dtos'

export class UpdateManyUserDto extends ValidateDto {
    @ApiProperty({
        description: "isArchived",
        required: true
    })
    @IsDefined()
    @IsBoolean()
    isArchived: boolean;
}
