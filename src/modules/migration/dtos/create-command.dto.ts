import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsEnum, IsString, IsOptional} from 'class-validator';

import {COLLECTION_NAMES, COLLECTIONS} from '../constants';

export class CreateCommandDto {
    @ApiProperty({
        description: 'Collection name',
        required: false,
        enum: COLLECTION_NAMES,
        default: COLLECTIONS.ALL,
    })
    @IsOptional()
    @IsEnum(COLLECTIONS)
    collectionName: string;

    @ApiProperty({
        description: 'apiKey',
        required: true,
    })
    @IsDefined()
    @IsString()
    apiKey: string;
}
