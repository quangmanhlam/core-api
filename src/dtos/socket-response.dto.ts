import {ApiProperty} from "@nestjs/swagger";

class Error {
    @ApiProperty({
        description: 'Error type',
    })
    type?: string;

    @ApiProperty({
        description: 'Error code',
    })
    code?: string;

    @ApiProperty({
        description: 'Error sub code',
    })
    subCode?: string;
}

export class SocketResponseDto {
    constructor(params: any) {
        // object.assign will overwrite defaults if params exist
        Object.assign(this, params);
    }
    @ApiProperty({
        description: 'status of response',
        enum: ['error', 'success'],
    })
    status: string;

    @ApiProperty({
        description: 'Error data',
    })
    error?: Error;

    @ApiProperty({
        description: 'message',
    })
    message?: string;

    @ApiProperty({
        description: 'data is object'
    })
    data: any;
}
