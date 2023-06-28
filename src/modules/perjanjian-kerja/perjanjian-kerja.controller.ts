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
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PerjanjianKerjaService } from "./perjanjian-kerja.service";
import { CreatePerjanjianKerjaDto } from "./dto/create-perjanjian-kerja.dto";
import { UpdatePerjanjianKerjaDto } from "./dto/update-perjanjian-kerja.dto";
import { GetAllPerjanjianKerjaDto } from "./dto/get-all-perjanjian-kerja.dto";
import { VerifyPerjanjianKerjaDto } from "./dto/verify-perjanjian-kerja.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Public, ValidationMessage } from "../../common";
import * as fileType from "file-type";

@ApiTags("Perjanjian Kerja")
@Controller("perjanjian-kerja")
@ApiBearerAuth()
export class PerjanjianKerjaController {
  constructor(private readonly perjanjianKerjaService: PerjanjianKerjaService) {}

  @ApiConsumes("multipart/form-data")
  @Post()
  async create(@Body() body: CreatePerjanjianKerjaDto) {
    if (!body.perjanjian_kerja) {
      throw new HttpException(
        { perjanjian_kerja: ValidationMessage.isNotEmpty },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    body.perjanjian_kerja = {
      file: body.perjanjian_kerja,
      ...(await fileType.fromBuffer(body.perjanjian_kerja as Buffer)),
    };

    return this.perjanjianKerjaService.create(body);
  }

  @Get()
  findAll(@Query() query: GetAllPerjanjianKerjaDto) {
    return this.perjanjianKerjaService.findAll(query);
  }

  @Get("filter")
  filter() {
    return this.perjanjianKerjaService.filter();
  }

  @Get("download-draft/:id")
  @Public()
  downloadDraft(@Param("id") id: string) {
    return this.perjanjianKerjaService.download(+id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.perjanjianKerjaService.findOne(+id);
  }

  @Patch("verify/:id")
  verify(
    @Param("id") id: string,
    @Body() body: VerifyPerjanjianKerjaDto,
    @Req() req: Record<string, any>,
  ) {
    body.verified_by = req.user.id;
    return this.perjanjianKerjaService.verify(+id, body);
  }

  @ApiConsumes("multipart/form-data")
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdatePerjanjianKerjaDto) {
    if (!body.perjanjian_kerja) {
      throw new HttpException(
        { perjanjian_kerja: ValidationMessage.isNotEmpty },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    body.perjanjian_kerja = {
      file: body.perjanjian_kerja,
      ...(await fileType.fromBuffer(body.perjanjian_kerja as Buffer)),
    };

    return this.perjanjianKerjaService.update(+id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.perjanjianKerjaService.remove(+id);
  }
}
