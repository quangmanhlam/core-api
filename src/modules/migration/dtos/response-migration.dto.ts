import {ApiProperty} from '@nestjs/swagger';

import {ResponseSuccessDto} from "../../../dtos";

class CreateCommandDto {
    success: boolean;
}

export class ResponseMigrationDto extends ResponseSuccessDto<CreateCommandDto> {
    @ApiProperty({type: CreateCommandDto})
    data: CreateCommandDto;
}
