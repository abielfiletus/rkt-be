import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CapaianService } from "./capaian.service";
import { CreateCapaianDto } from "./dto/create-capaian.dto";
import { UpdateCapaianDto } from "./dto/update-capaian.dto";

@Controller("capaian")
export class CapaianController {
  constructor(private readonly capaianService: CapaianService) {}

  @Post()
  create(@Body() createCapaianDto: CreateCapaianDto) {
    return this.capaianService.create(createCapaianDto);
  }

  @Get()
  findAll() {
    return this.capaianService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.capaianService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCapaianDto: UpdateCapaianDto) {
    return this.capaianService.update(+id, updateCapaianDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.capaianService.remove(+id);
  }
}
