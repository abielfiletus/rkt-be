import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { IndikatorKinerjaUtamaService } from "./indikator-kinerja-utama.service";
import {
  CreateIndikatorKinerjaUtamaDto,
  GetAllIndikatorKinerjaUtamaDto,
  UpdateIndikatorKinerjaUtamaDto,
} from "./dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "../../common";
import { FastifyReply } from "fastify";

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
  findAll(@Query() query: GetAllIndikatorKinerjaUtamaDto, @Req() req: Record<string, any>) {
    query.role_id = req.user.role_id;
    return this.indikatorKinerjaUtamaService.findAll(query);
  }

  @Public(false)
  @Get("multiple")
  findMultipleIds(@Query("id") id: string) {
    return this.indikatorKinerjaUtamaService.findMultipleId(id.split(","));
  }

  @Get("download")
  async download(@Query() query: GetAllIndikatorKinerjaUtamaDto, @Res() res: FastifyReply) {
    const file = await this.indikatorKinerjaUtamaService.download(query);

    return res
      .status(HttpStatus.OK)
      .header("Cross-Origin-Resource-Policy", "cross-origin")
      .type(file.type)
      .send(file.buffer);
  }

  @Public(false)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.indikatorKinerjaUtamaService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: UpdateIndikatorKinerjaUtamaDto) {
    return this.indikatorKinerjaUtamaService.update(+id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.indikatorKinerjaUtamaService.remove(+id);
  }
}
