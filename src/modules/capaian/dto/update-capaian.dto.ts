import { PartialType } from "@nestjs/mapped-types";
import { CreateCapaianDto } from "./create-capaian.dto";

export class UpdateCapaianDto extends PartialType(CreateCapaianDto) {}
