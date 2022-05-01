import {ApiProperty} from '@nestjs/swagger';

import {ResponseSuccessDto} from "../../../dtos";

class ResetPasswordDto {
    @ApiProperty({
        description: 'success'
    })
    success: boolean;
}

export class ResponseResetPasswordDto extends ResponseSuccessDto<ResetPasswordDto> {
    @ApiProperty({ type: ResetPasswordDto })
    data: ResetPasswordDto;
}
