import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginationDto } from "../../../common";
import { TransformBoolean } from "../../../common/decorator/transform-boolean.decorator";

export class GetAllConfigDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @TransformBoolean()
  status: boolean;
}
