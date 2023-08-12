import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { DepartmentService } from "./department.service";
import { CreateRoleDto } from "./dto/create-department.dto";
import { UpdateRoleDto } from "./dto/update-department.dto";
import { GetAllDepartmentDto } from "./dto/get-all-department.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Department")
@Controller("department")
@ApiBearerAuth()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.departmentService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() query: GetAllDepartmentDto) {
    return this.departmentService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.departmentService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.departmentService.update(+id, updateRoleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.departmentService.remove(+id);
  }
}
