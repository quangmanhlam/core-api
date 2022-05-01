import {ApiProperty} from "@nestjs/swagger";

class DeleteOneDto {
    @ApiProperty({
        description: 'deleted count'
    })
    deletedCount: number;
}

export class ResponseDeleteSuccessDto {
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
        description: 'Data is object.'
    })
    data: DeleteOneDto;
}
