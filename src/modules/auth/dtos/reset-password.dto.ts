import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    description: "verifyCode",
    required: true
  })
  @IsDefined()
  @IsString()
  verifyCode: string;

  @ApiProperty({
    description: "password: min length is 6 characters",
    required: true
  })
  @IsDefined()
  @IsString()
  @MinLength(6)
  password: string;
}
