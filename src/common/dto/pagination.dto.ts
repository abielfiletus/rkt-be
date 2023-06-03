import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, ValidateIf } from "class-validator";
import { Type } from "class-transformer";
import { ValidationMessage } from "../constant";

export class PaginationDto {
  @ApiProperty({ required: false, description: "page anda saat ini, default: 1" })
  @ValidateIf((obj) => obj.page)
  @IsInt({ message: ValidationMessage.number })
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ required: false, description: "default: 10" })
  @ValidateIf((obj) => obj.page)
  @IsInt({ message: ValidationMessage.number })
  @Type(() => Number)
  limit: number = 10;

  @ApiProperty({
    required: false,
    description:
      'Isi dengan nama field sesuai dengan yg anda terima, gunakan dot string jika field yang ingin anda sort berada di dalam object. Contoh: "user.id"',
  })
  @IsOptional()
  sort_field: string;

  @ApiProperty({ required: false, description: "Default adalah ascending", enum: ["ASC", "DESC"] })
  @ValidateIf((obj) => obj.sort_dir)
  @IsEnum(["ASC", "DESC"], { message: ValidationMessage.enum(["ASC", "DESC"]) })
  sort_dir: string;
}
