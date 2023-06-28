import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ValidationMessage } from "../../../common";

class UpdateDto {
  @ApiProperty()
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  @IsInt({ message: ValidationMessage.number })
  id_capaian_iku: number;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  @IsInt({ message: ValidationMessage.number })
  capaian: number;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  progress: string;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  masalah: string;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  strategi: string;
}

export class UpdateCapaianDto {
  @ApiProperty()
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  @Type(() => Array<UpdateDto>)
  @ValidateNested()
  data: Array<UpdateDto>;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  @IsIn([1, 2, 3, 4], { message: ValidationMessage.in([1, 2, 3, 4]) })
  tw_index: number;
}
