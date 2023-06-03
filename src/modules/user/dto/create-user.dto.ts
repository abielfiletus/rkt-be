import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  MaxLength,
} from "class-validator";
import { Match, ValidationMessage } from "../../../common";
import { Type } from "class-transformer";

export class CreateUserDto {
  @ApiProperty({ description: "Maksimal 50 karakter" })
  @MaxLength(50, { message: ValidationMessage.maxLength(50) })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  name: string;

  @ApiProperty({ description: "Maksimal 100 karakter" })
  @IsEmail({}, { message: ValidationMessage.validEmail })
  @MaxLength(100, { message: ValidationMessage.maxLength(100) })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  email: string;

  @ApiProperty({ description: "Maksimal 20 karakter" })
  @MaxLength(20, { message: ValidationMessage.maxLength(20) })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  nip: string;

  @ApiProperty({ description: "Kombinasi huruf besar, hufur kecil, angka dan simbol" })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    { message: ValidationMessage.validPassword },
  )
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: "Harus sama dengan password" })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  @Match("password", { message: ValidationMessage.matchField("Password") })
  confirmation_password: string;

  @ApiProperty({ description: "Kode prodi dari master data prodi" })
  @MaxLength(3, { message: ValidationMessage.maxLength(3) })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  kode_prodi: string;

  @ApiProperty()
  @IsInt({ message: ValidationMessage.number })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  @Type(() => Number)
  role_id: number;

  @ApiProperty()
  @IsInt({ message: ValidationMessage.number })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  @Type(() => Number)
  department_id: number;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  avatar: Buffer | Record<string, any>;
}
