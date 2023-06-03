import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreatePerjanjianKerjaDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  rkt_id: number;

  @ApiProperty({ required: true, type: "string", format: "binary" })
  @IsOptional()
  perjanjian_kerja: Buffer | Record<string, any>;
}
