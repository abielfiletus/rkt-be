import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from "@nestjs/common";
import { IndikatorKinerjaUtamaService } from "./indikator-kinerja-utama.service";
import {
  CreateIndikatorKinerjaUtamaDto,
  GetAllIndikatorKinerjaUtamaDto,
  UpdateIndikatorKinerjaUtamaDto,
} from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "../../common";

@ApiTags("Indikator Kinerja Utama")
@Controller("indikator-kinerja-utama")
@ApiBearerAuth()
export class IndikatorKinerjaUtamaController {
  constructor(private readonly indikatorKinerjaUtamaService: IndikatorKinerjaUtamaService) {}

  @Post()
  create(@Body() body: CreateIndikatorKinerjaUtamaDto, @Req() req: Record<string, any>) {
    body.created_by = req.user.id;
    return this.indikatorKinerjaUtamaService.create(body);
  }

  @Public(false)
  @Get()
  findAll(@Query() query: GetAllIndikatorKinerjaUtamaDto) {
    return this.indikatorKinerjaUtamaService.findAll(query);
  }

  @Public(false)
  @Get("multiple")
  findMultipleIds(@Query("id") id: string) {
    return this.indikatorKinerjaUtamaService.findMultipleId(id.split(","));
  }

  @Public(false)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.indikatorKinerjaUtamaService.findOne(+id);
  }
  a;

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateIndikatorKinerjaUtamaDto) {
    return this.indikatorKinerjaUtamaService.update(+id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.indikatorKinerjaUtamaService.remove(+id);
  }
}
