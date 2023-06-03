import { PaginationDto, ValidationMessage } from "../../../common";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, ValidateIf } from "class-validator";
import { RencanaStrategiScope } from "../entities/rencana-strategi.entity";
import { TransformBoolean } from "../../../common/decorator/transform-boolean.decorator";

export class GetAllRencanaStrategiDto extends PaginationDto {
  @ApiProperty({ required: false })
  @ValidateIf((obj) => obj.submit_by)
  @IsInt({ message: ValidationMessage.number })
  submit_by: number;

  @ApiProperty({ required: false })
  @IsOptional()
  prodi: string;

  @ApiProperty({ required: false })
  @IsOptional()
  keyword: string;

  @ApiProperty({ required: false })
  @IsOptional()
  tahun: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @TransformBoolean()
  status: boolean;

  @ApiProperty({
    required: false,
    enum: Object.keys(RencanaStrategiScope),
    description: "Join table ke table apa, default tidak ada",
  })
  @IsOptional()
  join: string;
}
