import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, ValidateIf } from "class-validator";
import { TransformBoolean } from "../../../common/decorator/transform-boolean.decorator";

export class UpdateIndikatorKinerjaUtamaDto {
  @ApiProperty()
  @IsOptional()
  no: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @ValidateIf((obj) => obj.is_active)
  @IsBoolean()
  @TransformBoolean()
  is_active: boolean;
}
