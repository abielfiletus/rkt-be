import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, ValidateIf } from "class-validator";
import { ValidationMessage, VerificationStatus } from "../../../common";

export class VerifyRencanaStrategiDto {
  @ApiProperty()
  @ValidateIf((obj) =>
    [VerificationStatus.revision, VerificationStatus.rejected].includes(obj.status),
  )
  @IsNotEmpty({ message: ValidationMessage.isNotEmpty })
  note: string;

  @ApiProperty()
  @IsEnum(VerificationStatus)
  @IsNotEmpty()
  status: VerificationStatus;

  verified_by: number;
}
