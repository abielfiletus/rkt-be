import { PartialType } from "@nestjs/mapped-types";
import { CreateRoleDto } from "./create-department.dto";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
