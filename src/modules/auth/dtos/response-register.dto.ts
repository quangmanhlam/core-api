import {ApiProperty} from '@nestjs/swagger';

import {ResponseSuccessDto} from "../../../dtos";

class ResponseRegister {
    @ApiProperty({
        description: 'success'
    })
    success: boolean;
}

export class ResponseRegisterDto extends ResponseSuccessDto<ResponseRegister> {
    @ApiProperty({type: ResponseRegister})
    data: ResponseRegister;
}
