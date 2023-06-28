import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, ValidateIf } from "class-validator";
import { CapaianStatus, ValidationMessage } from "../../../common";

export class GetAllCapaianDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  tahun: string;

  @ApiProperty({ required: false })
  @ValidateIf((obj) => obj.usulan_anggaran)
  @IsInt({ message: ValidationMessage.number })
  usulan_anggaran: number;

  @ApiProperty({ required: false, enum: Object.values(CapaianStatus) })
  @ValidateIf((obj) => obj.status)
  @IsEnum(Object.values(CapaianStatus), {
    message: ValidationMessage.enum(Object.values(CapaianStatus)),
  })
  status: CapaianStatus;
}
