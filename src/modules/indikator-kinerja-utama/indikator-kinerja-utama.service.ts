import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import {
  CreateIndikatorKinerjaUtamaDto,
  GetAllIndikatorKinerjaUtamaDto,
  UpdateIndikatorKinerjaUtamaDto,
} from "./dto";
import {
  IndikatorKinerjaUtama,
  IndikatorKinerjaUtamaScope,
} from "./entities/indikator-kinerja-utama.entity";
import { isNotEmpty, prepareQuery } from "../../util";
import { Op } from "sequelize";
import { HttpMessage } from "../../common";
import * as fs from "fs";
import { excel } from "../../util/excel";

@Injectable()
export class IndikatorKinerjaUtamaService {
  constructor(
    @Inject(IndikatorKinerjaUtama.name)
    private readonly ikuModel: typeof IndikatorKinerjaUtama,
  ) {}

  create(body: CreateIndikatorKinerjaUtamaDto) {
    return this.ikuModel.create({ ...body });
  }

  async findAll(params: GetAllIndikatorKinerjaUtamaDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, IndikatorKinerjaUtamaScope);

    if (isNotEmpty(params.is_active)) where.is_active = params.is_active;
    if (params.no) where.no = params.no;
    if (params.name) where.name = { [Op.iLike]: `%${params.name}%` };

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.ikuModel.findAll({ where, limit, offset, order, include }),
      this.ikuModel.count({ where, include }),
      this.ikuModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  async findMultipleId(ids: Array<string>) {
    return this.ikuModel.findAll({ where: { id: { [Op.in]: ids } } });
  }

  findOne(id: number) {
    return this.ikuModel.findByPk(id, { include: IndikatorKinerjaUtamaScope.all });
  }

  async update(id: number, body: UpdateIndikatorKinerjaUtamaDto) {
    const check = await this.ikuModel.findByPk(id, { raw: true });
    if (!check) {
      throw new HttpException(HttpMessage.notFound, HttpStatus.NOT_FOUND);
    }

    const mock: Record<string, any> = {};
    Object.keys(body).map((key) => {
      console.log(key);
      if (isNotEmpty(body[key])) {
        console.log(key);
        mock[key] = body[key];
      }
    });

    const data = await this.ikuModel.update(mock, { where: { id }, returning: true });

    return data[1][0];
  }

  remove(id: number) {
    return this.ikuModel.destroy({ where: { id } });
  }

  async download(params: GetAllIndikatorKinerjaUtamaDto) {
    const where: Record<string, any> = {};

    if (isNotEmpty(params.is_active)) where.is_active = params.is_active;
    if (params.no) where.no = params.no;
    if (params.name) where.name = { [Op.iLike]: `%${params.name}%` };

    const rawData = await this.ikuModel.findAll({ where, include: IndikatorKinerjaUtamaScope.all });

    const data = [];
    rawData.map((item, i) => {
      data.push({
        no: item.no,
        name: item.name,
        is_active: item.is_active ? "Aktif" : "Tidak Aktif",
        created_by: item.user_create.name,
        numbering: i + 1,
      });
    });
    const header = {
      No: "numbering",
      "Nomor IKU": "no",
      "Nama IKU": "name",
      Status: "is_active",
      "Dibuat Oleh": "created_by",
    };
    const field = {
      numbering: "numbering",
      no: "no",
      name: "name",
      is_active: "is_active",
      created_by: "created_by",
    };

    return await excel
      .init({
        filename: `Data Indikator Kinerja Unit ${Date.now()}`,
        headerTitle: header,
        rowsData: data,
        rowsField: field,
        showGridLines: false,
      })
      .addWorkSheet({ name: "Data" })
      .addHeader()
      .addRows()
      .autoSizeColumn()
      .addBgColor()
      .addBorder()
      .generate();
  }
}
