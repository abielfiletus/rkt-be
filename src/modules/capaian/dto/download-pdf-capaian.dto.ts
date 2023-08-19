import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class DownloadPdfCapaianDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  rkt_id: number;

  @ApiProperty({ type: Number, isArray: true })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(["1", "2", "3", "4"], { each: true })
  tw_checked: Array<"1" | "2" | "3" | "4">;
}
