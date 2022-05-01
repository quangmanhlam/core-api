import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined } from "class-validator";

export class RequestDeleteManyDto {
    @ApiProperty({
        description: "delete by ids. Example in body: {ids: [1,2,3]}",
        required: true
    })
    @IsDefined()
    @IsArray()
    ids: string[];

    getIds() {
        return this.ids;
    }
}
