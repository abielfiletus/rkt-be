import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, ValidateIf } from "class-validator";
import { PaginationDto, ValidationMessage, VerificationStatus } from "../../../common";
import { PenyusunanRktScope } from "../entities/penyusunan-rkt.entity";
import { Type } from "class-transformer";

export class GetAllPenyusunanRktDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  tahun: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  submit_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  submit_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  submit_prodi: string;

  @ApiProperty({ required: false, enum: Object.values(VerificationStatus) })
  @ValidateIf((obj) => obj.status)
  @IsEnum(Object.values(VerificationStatus), {
    message: ValidationMessage.enum(Object.values(VerificationStatus)),
  })
  status: VerificationStatus;

  @ApiProperty({ required: false, enum: Object.keys(PenyusunanRktScope) })
  @IsOptional()
  join: string;
}
