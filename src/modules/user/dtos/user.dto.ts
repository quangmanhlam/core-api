import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({
        description: "id"
    })
    _id: string;

    @ApiProperty({
        description: "name"
    })
    name: string;

    @ApiProperty({
        description: "email"
    })
    email: string;

    @ApiProperty({
        description: "phone"
    })
    phone: string;

    @ApiProperty({
        description: "roleId"
    })
    roleId: string;

    @ApiProperty({
        description: "status"
    })
    status: string;

    @ApiProperty({
        description: "settings"
    })
    settings: object;

    @ApiProperty({
        description: "isRootAdmin"
    })
    isRootAdmin: boolean;

    @ApiProperty({
        description: "is archived"
    })
    isArchived: boolean;

    @ApiProperty({
        description: "is deleted"
    })
    isDeleted: boolean;

    @ApiProperty({
        description: "created by"
    })
    createdBy: string;

    @ApiProperty({
        description: "updated by"
    })
    updatedBy: string;

    @ApiProperty({
        description: "deleted by"
    })
    deletedBy: string;

    @ApiProperty({
        description: "deleted at"
    })
    deletedAt: string;

    @ApiProperty({
        description: "created at"
    })
    createdAt: string;

    @ApiProperty({
        description: "updated at"
    })
    updatedAt: string;
}
