import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { TransformBoolean } from "../../../common/decorator/transform-boolean.decorator";

export class UpdateConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @TransformBoolean()
  status: boolean;
}
