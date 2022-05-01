import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsArray } from "class-validator";

export class RequestUpdateManyDto {
    @ApiProperty({
        description: "Search by ids. Example: /users?ids=1,2,4,5. Example in body: {ids: [1,2,3]}",
        required: false
    })
    @IsOptional()
    @IsArray()
    ids: Array<string>;

    getIds() {
        return this.ids;
    }
}
