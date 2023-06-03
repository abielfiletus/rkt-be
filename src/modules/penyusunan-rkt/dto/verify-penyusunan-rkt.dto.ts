import { ApiProperty } from "@nestjs/swagger";
import { VerificationStatus } from "../../../common";
import { IsEnum, IsNotEmpty, ValidateIf } from "class-validator";

export class VerifyPenyusunanRktDto {
  @ApiProperty({ enum: Object.keys(VerificationStatus) })
  @IsNotEmpty()
  @IsEnum(Object.keys(VerificationStatus))
  status: VerificationStatus;

  @ApiProperty()
  @ValidateIf((obj) => ["rejected", "revision"].includes(obj.status))
  @IsNotEmpty()
  notes: string;

  verified_by: number;
}
