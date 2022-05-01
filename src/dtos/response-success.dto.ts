import {ApiProperty} from "@nestjs/swagger";

export class ResponseSuccessDto<T> {
    constructor(params: any) {
        // object.assign will overwrite defaults if params exist
        Object.assign(this, params);
    }
    @ApiProperty({
        description: 'Total documents',
        default: 0,
    })
    total: number = 0;

    @ApiProperty({
        description: 'Data is object or array. Return array if get many, return object if get one.'
    })
    data: T;
}
