import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, MaxLength, ValidateIf } from "class-validator";
import { ValidationMessage } from "../../../common";

export class UpdateDocumentDto {
  @ApiProperty({ description: "Maksimal 50 karakter" })
  @ValidateIf((obj) => obj.name)
  @MaxLength(50, { message: ValidationMessage.maxLength(50) })
  name: string;

  @ApiProperty({ description: "Maksimal 255 karakter" })
  @ValidateIf((obj) => obj.description)
  @MaxLength(255, { message: ValidationMessage.maxLength(255) })
  description: string;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  file: Buffer | Record<string, any>;
}
