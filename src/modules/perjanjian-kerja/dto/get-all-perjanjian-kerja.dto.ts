import { PaginationDto, VerificationStatus } from "../../../common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, ValidateIf } from "class-validator";
import { PerjanjianKerjaScope } from "../entities/perjanjian-kerja.entity";

export class GetAllPerjanjianKerjaDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  rkt_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  rkt_anggaran: number;

  @ApiProperty({ required: false })
  @IsOptional()
  rkt_tahun: number;

  @ApiProperty({ required: false })
  @IsOptional()
  submit_prodi: string;

  @ApiProperty({ required: false, enum: Object.values(VerificationStatus) })
  @ValidateIf((obj) => obj.status)
  @IsEnum(Object.values(VerificationStatus))
  status: VerificationStatus;

  @ApiProperty({ required: false, enum: Object.keys(PerjanjianKerjaScope) })
  @IsOptional()
  join: string;
}
