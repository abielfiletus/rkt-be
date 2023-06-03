import { PartialType } from "@nestjs/mapped-types";
import { CreateProdiDto } from "./create-prodi.dto";

export class UpdateProdiDto extends PartialType(CreateProdiDto) {}
