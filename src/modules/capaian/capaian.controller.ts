import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { CapaianService } from "./capaian.service";
import { CreateCapaianDto } from "./dto/create-capaian.dto";
import { GetAllCapaianDto } from "./dto/get-all-capaian.dto";
import { UpdateCapaianDto } from "./dto/update-capaian.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Public } from "../../common";

@Controller("capaian")
@ApiBearerAuth()
@Public()
export class CapaianController {
  constructor(private readonly capaianService: CapaianService) {}

  @Post()
  create(@Body() body: CreateCapaianDto) {
    return this.capaianService.create(body);
  }

  @Get()
  findAll(@Query() query: GetAllCapaianDto) {
    return this.capaianService.findAll(query);
  }

  @Get("detail-by-rkt/:id")
  detailByRkt(@Param("id") id: string) {
    return this.capaianService.detailByRkt(+id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.capaianService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateCapaianDto) {
    return this.capaianService.update(+id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.capaianService.remove(+id);
  }
}
