import { PaginationDto } from "../../../common";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, ValidateIf } from "class-validator";
import { TransformBoolean } from "../../../common/decorator/transform-boolean.decorator";

export class GetAllIndikatorKinerjaUtamaDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  no: string;

  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @ValidateIf((obj) => obj.is_active)
  @IsBoolean()
  @TransformBoolean()
  is_active: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  tahun: string;

  @ApiProperty({
    required: false,
    enum: ["all"],
    description: "Join table ke table apa, default tidak ada",
  })
  @IsOptional()
  join: string;
}
