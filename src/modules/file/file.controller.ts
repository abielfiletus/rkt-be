import { Controller, Get, HttpException, HttpStatus, Req, Res } from "@nestjs/common";
import { Public } from "../../common";
import { FastifyReply, FastifyRequest } from "fastify";
import * as fileType from "file-type";
import * as fs from "fs";
import { ApiExcludeController } from "@nestjs/swagger";

@ApiExcludeController()
@Public()
@Controller("uploads")
export class FileController {
  @Get("*")
  async getFile(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    try {
      const filepath = req.raw.url.replace("/api/v1/", "");

      const file = fs.readFileSync(`${__dirname}/../../../${filepath}`);
      const type = await fileType.fromBuffer(file);

      return res
        .status(HttpStatus.OK)
        .header("Cross-Origin-Resource-Policy", "cross-origin")
        .type(type.mime)
        .send(file);
    } catch (err) {
      if (err.code === "ENOENT") {
        throw new HttpException("File tidak ditemukan", HttpStatus.NOT_FOUND);
      }
    }
  }
}
