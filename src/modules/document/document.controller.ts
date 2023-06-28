import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { CreateDocumentDto, GetAllDocumentDto, UpdateDocumentDto } from "./dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import * as fileType from "file-type";

@ApiTags("Document")
@ApiBearerAuth()
@Controller("document")
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @ApiConsumes("multipart/form-data")
  @Post()
  async create(@Body() body: CreateDocumentDto) {
    if (body.file) {
      body.file = { file: body.file, ...(await fileType.fromBuffer(body.file as Buffer)) };
    }

    return await this.documentService.create(body);
  }

  @Get()
  findAll(@Query() query: GetAllDocumentDto) {
    return this.documentService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.documentService.findOne(+id);
  }

  @ApiConsumes("multipart/form-data")
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateDocumentDto) {
    if (body.file) {
      body.file = { file: body.file, ...(await fileType.fromBuffer(body.file as Buffer)) };
    }

    const data = await this.documentService.update(+id, body);

    return data[1] ? data[1][0] : null;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.documentService.remove(+id);
  }
}
