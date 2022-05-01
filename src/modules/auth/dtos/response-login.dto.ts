import {ApiProperty} from '@nestjs/swagger';

import {ResponseSuccessDto} from "../../../dtos";

class ResponseLogin {
    @ApiProperty({
        description: 'token'
    })
    token: string;
}

export class ResponseLoginDto extends ResponseSuccessDto<ResponseLogin> {
    @ApiProperty({type: ResponseLogin})
    data: ResponseLogin;
}
