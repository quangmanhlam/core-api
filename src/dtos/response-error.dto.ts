import {ApiProperty} from "@nestjs/swagger";

export class ResponseErrorDto {
    constructor(params: any) {
        // object.assign will overwrite defaults if params exist
        Object.assign(this, params);
    }
    @ApiProperty({
        description: 'type error',
    })
    type?: string;

    @ApiProperty({
        description: 'error code',
        required: true
    })
    code: number;

    @ApiProperty({
        description: 'Error sub code',
    })
    subCode?: number;

    @ApiProperty({
        description: 'Sub title'
    })
    subTitle?: string;

    @ApiProperty({
        description: 'Error message'
    })
    message: string;

    @ApiProperty({
        description: 'Error name'
    })
    name?: string;

    @ApiProperty({
        description: 'Error data'
    })
    data?: any;
}
