import { ApiProperty } from "@nestjs/swagger";
import { VerificationStatus } from "../../../common";
import { IsEnum, IsNotEmpty, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

export class VerifyPenyusunanRktDto {
  @ApiProperty({ enum: Object.keys(VerificationStatus) })
  @IsNotEmpty()
  @IsEnum(Object.values(VerificationStatus))
  @Transform(({ value }) => VerificationStatus[value])
  status: VerificationStatus;

  @ApiProperty()
  @ValidateIf((obj) => ["rejected", "revision"].includes(obj.status))
  @IsNotEmpty()
  notes: string;

  verified_by: number;
  verified_name: string;
}
