import { Module } from "@nestjs/common";
import { DepartmentService } from "./department.service";
import { DepartmentController } from "./department.controller";
import { Department } from "./entities/department.entity";

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService, { provide: Department.name, useValue: Department }],
})
export class DepartmentModule {}
