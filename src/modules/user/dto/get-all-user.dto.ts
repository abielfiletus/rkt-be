import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { UserScopes } from "../entities/user.entity";
import { PaginationDto } from "../../../common";

export class GetAllUserDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: "Query menggunakan contains string",
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    description: "Query menggunakan exact match",
  })
  @IsOptional()
  email: string;

  @ApiProperty({
    required: false,
    description: "Query menggunakan exact match",
  })
  @IsOptional()
  nip: string;

  @ApiProperty({
    required: false,
    description:
      "Akan query ke field name, email dan nama prodi. Akan otomatis join ke table prodi",
  })
  @IsOptional()
  keyword: string;

  @ApiProperty({
    required: false,
    description: "Hanya bisa menggunakan id dari role",
  })
  @IsOptional()
  @Type(() => Number)
  role_id: number;

  @ApiProperty({
    required: false,
    enum: Object.keys(UserScopes),
    description: "Join table ke table apa, default tidak ada",
  })
  @IsOptional()
  join: string;
}
