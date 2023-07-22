import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { PenyusunanRktService } from "./penyusunan-rkt.service";
import { CreatePenyusunanRktDto } from "./dto/create-penyusunan-rkt.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import * as fileType from "file-type";
import { ValidationMessage } from "../../common";
import { GetAllPenyusunanRktDto } from "./dto/get-all-penyusunan-rkt.dto";
import { VerifyPenyusunanRktDto } from "./dto/verify-penyusunan-rkt.dto";

@ApiTags("Penyusunan RKT")
@Controller("penyusunan-rkt")
@ApiBearerAuth()
export class PenyusunanRktController {
  constructor(private readonly penyusunanRktService: PenyusunanRktService) {}

  @ApiConsumes("multipart/form-data")
  @Post()
  async create(@Body() body: CreatePenyusunanRktDto, @Req() req: Record<string, any>) {
    const uploadFields = ["kak", "referensi_harga", "pendukung"];
    const errorUpload = {};

    uploadFields.map((field) => {
      if (!body[field]) errorUpload[field] = ValidationMessage.isNotEmpty;
    });

    if (Object.keys(errorUpload).length) {
      throw new HttpException(errorUpload, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    body.kak = { file: body.kak, ...(await fileType.fromBuffer(body.kak as Buffer)) };
    body.surat_usulan = {
      file: body.surat_usulan,
      ...(await fileType.fromBuffer(body.surat_usulan as Buffer)),
    };
    body.referensi_harga = {
      file: body.referensi_harga,
      ...(await fileType.fromBuffer(body.referensi_harga as Buffer)),
    };
    body.pendukung = {
      file: body.pendukung,
      ...(await fileType.fromBuffer(body.pendukung as Buffer)),
    };
    body.submit_by = req.user.id;

    return await this.penyusunanRktService.create(body);
  }

  @Get()
  findAll(@Query() query: GetAllPenyusunanRktDto, @Req() req: Record<string, any>) {
    query.user_id = req.user?.id;
    query.user_role = req.user?.role_id;
    return this.penyusunanRktService.findAll(query);
  }

  @Get("filter")
  filter(@Req() req: Record<string, any>) {
    return this.penyusunanRktService.filter(req.user?.id, req.user?.role_id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.penyusunanRktService.findOne(+id);
  }

  @Patch("verify/:id")
  verify(
    @Param("id") id: string,
    @Body() body: VerifyPenyusunanRktDto,
    @Req() req: Record<string, any>,
  ) {
    body.verified_by = req.user.id;
    body.verified_name = req.user.name;
    return this.penyusunanRktService.approval(+id, body);
  }

  @ApiConsumes("multipart/form-data")
  @Patch(":id")
  update(@Param("id") id: string, @Body() body: CreatePenyusunanRktDto) {
    return this.penyusunanRktService.update(+id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.penyusunanRktService.remove(+id);
  }
}
