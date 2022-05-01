import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    description: "Email",
    required: true
  })
  @IsDefined()
  @IsEmail()
  email: string;
}
