import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TransformObject } from "../../../common/decorator/transform-object.decorator";

class IkuXAksi {
  @ApiProperty()
  @IsNotEmpty()
  rencana_aksi: string;

  iku_id: number;
}

export class RktXIkuDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  iku_id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  tw_1: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  tw_2: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  tw_3: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  tw_4: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  total: number;

  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  aksi_data: IkuXAksi[];
}

export class RktXRabDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  unit: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;
}

export class CreatePenyusunanRktDto {
  @ApiProperty()
  @IsNotEmpty()
  tahun: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  target_perjanjian_kerja: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  usulan_anggaran: number;

  @ApiProperty({ type: [RktXIkuDto] })
  @IsNotEmpty()
  @TransformObject(true)
  iku_data: Record<string, any>[];

  @ApiProperty({ type: [RktXRabDto] })
  @IsNotEmpty()
  @TransformObject(true)
  rab_data: Record<string, any>[];

  @ApiProperty({ required: true, type: "string", format: "binary" })
  @IsOptional()
  surat_usulan: Buffer | Record<string, any>;

  @ApiProperty({ required: true, type: "string", format: "binary" })
  @IsOptional()
  kak: Buffer | Record<string, any>;

  @ApiProperty({ required: true, type: "string", format: "binary" })
  @IsOptional()
  referensi_harga: Buffer | Record<string, any>;

  @ApiProperty({ required: true, type: "string", format: "binary" })
  @IsOptional()
  pendukung: Buffer | Record<string, any>;

  submit_by: number;
}
