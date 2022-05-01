import { ApiProperty } from '@nestjs/swagger';

import {ResponseSuccessDto} from "../../../dtos";

class ForgotPasswordDto {
    @ApiProperty({
        description: 'success'
    })
    success: boolean;
}

export class ResponseForgotPasswordDto extends ResponseSuccessDto<ForgotPasswordDto> {
    @ApiProperty({ type: ForgotPasswordDto })
    data: ForgotPasswordDto;
}
