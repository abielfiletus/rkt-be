import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdatePerjanjianKerjaDto {
  @ApiProperty({ required: true, type: "string", format: "binary" })
  @IsOptional()
  perjanjian_kerja: Buffer | Record<string, any>;

  submit_by: number;
}
