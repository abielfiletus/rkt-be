import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginationDto } from "../../../common";

export class GetAllDepartmentDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;
}
