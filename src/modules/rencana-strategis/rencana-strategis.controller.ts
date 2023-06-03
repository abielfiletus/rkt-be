import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from "@nestjs/common";
import { RencanaStrategisService } from "./rencana-strategis.service";
import {
  CreateRencanaStrategiDto,
  GetAllRencanaStrategiDto,
  UpdateRencanaStrategiDto,
} from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Rencana Strategis")
@Controller("rencana-strategis")
@ApiBearerAuth()
export class RencanaStrategisController {
  constructor(private readonly rencanaStrategisService: RencanaStrategisService) {}

  @Post()
  create(@Body() body: CreateRencanaStrategiDto, @Req() req: Record<string, any>) {
    body.submit_by = req.user.id;
    return this.rencanaStrategisService.create(body);
  }

  @Get()
  findAll(@Query() query: GetAllRencanaStrategiDto) {
    return this.rencanaStrategisService.findAll(query);
  }

  @Get("filter")
  filter() {
    return this.rencanaStrategisService.filter();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.rencanaStrategisService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateRencanaStrategiDto) {
    return this.rencanaStrategisService.update(+id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.rencanaStrategisService.remove(+id);
  }
}
