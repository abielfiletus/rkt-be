import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Document } from "./entities/document.entity";
import { CreateDocumentDto, GetAllDocumentDto, UpdateDocumentDto } from "./dto";
import { HttpMessage } from "../../common";
import { Op } from "sequelize";
import * as fs from "fs-extra";
import { isNotEmpty, prepareQuery, RollbackFile, UploadFile } from "../../util";

@Injectable()
export class DocumentService {
  constructor(@Inject(Document.name) private readonly documentModel: typeof Document) {}

  async create(body: CreateDocumentDto) {
    let file;
    try {
      file = await this._uploadFile(body.file, body.name);
      body.file = file;

      return this.documentModel.create({ ...body });
    } catch (err) {
      if (file) {
        const filePath = file.path.replace(process.env.URL, "");
        if (fs.existsSync(filePath)) fs.removeSync("./" + filePath);
      }

      throw err;
    }
  }

  async findAll(params: GetAllDocumentDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, {});

    if (params.name) where.name = { [Op.iLike]: `%${params.name}%` };

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.documentModel.findAll({
        where,
        limit,
        offset,
        order,
        include,
        attributes: { exclude: ["password"] },
      }),
      this.documentModel.count({ where, include }),
      this.documentModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.documentModel.findByPk(id);
  }

  async update(id: number, body: UpdateDocumentDto) {
    let file = "";
    try {
      const check = await this.documentModel.findByPk(id, { raw: true });
      if (!check) {
        throw new HttpException(HttpMessage.notFound, HttpStatus.NOT_FOUND);
      }

      const mock: Record<string, any> = {};
      Object.keys(body).map((key) => {
        if (isNotEmpty(body[key])) mock[key] = body[key];
      });

      if (body.file) {
        file = await this._uploadFile(body.file, check.name);
        mock.file = file;
      }

      return this.documentModel.update(mock, { where: { id }, returning: true });
    } catch (err) {
      await RollbackFile(file);
      throw err;
    }
  }

  remove(id: number) {
    return this.documentModel.destroy({ where: { id } });
  }

  private async _uploadFile(file: Record<string, any>, name: string) {
    return await UploadFile({
      file: file.file,
      filename: name + "." + file.ext,
      ext: file.ext,
      folder: "uploads/document/",
      field: "file",
      allowedSize: "1 mb",
      allowedExt: ["pdf"],
    });
  }
}
