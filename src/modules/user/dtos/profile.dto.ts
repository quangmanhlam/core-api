import { ApiProperty } from "@nestjs/swagger";

class Action {
    @ApiProperty({
        description: "object id"
    })
    _id: string;

    @ApiProperty({
        description: "name"
    })
    name: string;

    @ApiProperty({
        description: "key"
    })
    key: string;

    @ApiProperty({
        description: "method"
    })
    method: string;

    @ApiProperty({
        description: "url"
    })
    url: string;
}

class Permission {
    @ApiProperty({
        description: "id"
    })
    _id: string;

    @ApiProperty({
        description: "name"
    })
    name: string;

    @ApiProperty({
        description: "key"
    })
    key: string;

    @ApiProperty({
        description: "list action",
        type: [Action]
    })
    actions: Array<Action>;
}

export class ProfileDto {
    @ApiProperty({
        description: "object id"
    })
    _id: string;

    @ApiProperty({
        description: "name"
    })
    name: string;

    @ApiProperty({
        description: "phone"
    })
    phone: string;

    @ApiProperty({
        description: "role id"
    })
    roleId: string;

    @ApiProperty({
        description: "list permissions",
        type: [Permission]
    })
    permissions: Array<Permission>;
}
