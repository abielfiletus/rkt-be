import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { ValidationMessage } from "../../../common";

export class CreateDocumentDto {
  @ApiProperty({ description: "Maksimal 50 karakter" })
  @MaxLength(50, { message: ValidationMessage.maxLength(50) })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  name: string;

  @ApiProperty({ description: "Maksimal 255 karakter" })
  @MaxLength(255, { message: ValidationMessage.maxLength(255) })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  description: string;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  file: Buffer | Record<string, any>;
}
