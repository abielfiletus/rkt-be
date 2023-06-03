import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, MaxLength } from "class-validator";
import { ValidationMessage } from "../../../common";
import { TransformBoolean } from "../../../common/decorator/transform-boolean.decorator";

export class UpdateRencanaStrategiDto {
  @ApiProperty()
  @MaxLength(4, { message: ValidationMessage.maxLength(4) })
  @IsOptional()
  tahun: string;

  @ApiProperty()
  @IsOptional()
  visi: string;

  @ApiProperty()
  @IsOptional()
  misi: string;

  @ApiProperty()
  @IsOptional()
  tujuan: string;

  @ApiProperty()
  @IsOptional()
  sasaran: string;

  @ApiProperty()
  @IsOptional()
  @TransformBoolean()
  is_active: boolean;

  submit_by: number;
}
