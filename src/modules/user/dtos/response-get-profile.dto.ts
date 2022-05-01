import {ApiProperty} from '@nestjs/swagger';

import {ProfileDto} from './profile.dto';
import {ResponseSuccessDto} from "../../../dtos";

export class ResponseGetProfileDto extends ResponseSuccessDto<ProfileDto> {
    @ApiProperty({type: ProfileDto})
    data: ProfileDto;
}
