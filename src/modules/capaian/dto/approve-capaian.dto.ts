import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { CapaianStatus, ValidationMessage } from "../../../common";

export class ApproveCapaianDto {
  @ApiProperty({ enum: Object.keys(CapaianStatus) })
  @IsNotEmpty()
  @IsEnum(Object.keys(CapaianStatus), {
    message: ValidationMessage.enum(Object.keys(CapaianStatus)),
  })
  status: CapaianStatus;
}
