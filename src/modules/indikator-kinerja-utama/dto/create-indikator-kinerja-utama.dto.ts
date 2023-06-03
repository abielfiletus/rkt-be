import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty } from "class-validator";
import { TransformBoolean } from "../../../common/decorator/transform-boolean.decorator";

export class CreateIndikatorKinerjaUtamaDto {
  @ApiProperty()
  @IsNotEmpty()
  no: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  @TransformBoolean()
  is_active: boolean;

  created_by: number;
}
