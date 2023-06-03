import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { GetAllRoleDto } from "./dto/get-all-role.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Role")
@Controller("role")
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() body: CreateRoleDto) {
    return this.roleService.create(body);
  }

  @Get()
  findAll(@Query() query: GetAllRoleDto) {
    return this.roleService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.roleService.remove(+id);
  }
}
