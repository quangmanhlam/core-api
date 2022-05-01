import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from "./user.dto";
import { ResponseSuccessDto } from "../../../dtos";

export class ResponseGetOneUserDto extends ResponseSuccessDto<UserDto> {
    @ApiProperty({ type: UserDto })
    data: UserDto;
}
