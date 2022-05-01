import { ApiProperty } from "@nestjs/swagger";

export class DeleteSuccessDto {
  @ApiProperty({
    description: "deleted count"
  })
  deletedCount: number;
}
