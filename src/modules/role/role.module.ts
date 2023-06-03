import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { Role } from "./entities/role.entity";

@Module({
  controllers: [RoleController],
  providers: [RoleService, { provide: Role.name, useValue: Role }],
})
export class RoleModule {}
