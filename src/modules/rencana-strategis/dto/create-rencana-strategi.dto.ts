import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { ValidationMessage } from "../../../common";
import { TransformBoolean } from "../../../common/decorator/transform-boolean.decorator";

export class CreateRencanaStrategiDto {
  @ApiProperty()
  @MaxLength(4, { message: ValidationMessage.maxLength(4) })
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  tahun: string;

  @ApiProperty()
  @IsNotEmpty()
  visi: string;

  @ApiProperty()
  @IsNotEmpty()
  misi: string;

  @ApiProperty()
  @IsNotEmpty()
  tujuan: string;

  @ApiProperty()
  @IsNotEmpty()
  sasaran: string;

  @ApiProperty()
  @IsOptional()
  @TransformBoolean()
  is_active: boolean;

  submit_by: number;
}
