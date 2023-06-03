import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";
import { ValidationMessage } from "../../../common";

export class CreateProdiDto {
  @ApiProperty()
  @MaxLength(100, { message: ValidationMessage.maxLength(100) })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @MaxLength(3, { message: ValidationMessage.maxLength(3) })
  @IsNotEmpty()
  kode_prodi: string;
}
