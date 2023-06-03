import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsOptional, MaxLength, ValidateIf } from "class-validator";
import { ValidationMessage } from "../../../common";
import { Type } from "class-transformer";

export class UpdateUserDto {
  @ApiProperty({ required: false, description: "Maksimal 50 karakter" })
  @ValidateIf((obj) => obj.name)
  @MaxLength(50, { message: ValidationMessage.maxLength(50) })
  name: string;

  @ApiProperty({ required: false, description: "Maksimal 100 karakter" })
  @ValidateIf((obj) => obj.name)
  @IsEmail({}, { message: ValidationMessage.validEmail })
  @MaxLength(100, { message: ValidationMessage.maxLength(100) })
  email: string;

  @ApiProperty({ required: false, description: "Maksimal 20 karakter" })
  @ValidateIf((obj) => obj.name)
  @MaxLength(20, { message: ValidationMessage.maxLength(20) })
  nip: string;

  @ApiProperty({ required: false, description: "Kode prodi dari master data prodi" })
  @ValidateIf((obj) => obj.name)
  @MaxLength(3, { message: ValidationMessage.maxLength(3) })
  kode_prodi: string;

  @ApiProperty({ required: false })
  @ValidateIf((obj) => obj.name)
  @IsInt({ message: ValidationMessage.number })
  @Type(() => Number)
  role_id: number;

  @ApiProperty()
  @ValidateIf((obj) => obj.name)
  @IsInt({ message: ValidationMessage.number })
  @Type(() => Number)
  department_id: number;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  avatar: Buffer | Record<string, any>;
}
