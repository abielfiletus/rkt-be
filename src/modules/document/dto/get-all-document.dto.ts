import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginationDto } from "../../../common";

export class GetAllDocumentDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: "Query menggunakan contains string",
  })
  @IsOptional()
  name: string;
}
