import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import {
  CreateRencanaStrategiDto,
  GetAllRencanaStrategiDto,
  UpdateRencanaStrategiDto,
} from "./dto";
import { RencanaStrategi, RencanaStrategiScope } from "./entities/rencana-strategi.entity";
import { isNotEmpty, prepareQuery } from "../../util";
import { Op } from "sequelize";
import { HttpMessage, VerificationStatusReverse } from "../../common";

@Injectable()
export class RencanaStrategisService {
  constructor(
    @Inject(RencanaStrategi.name)
    private readonly rencanaStategiModel: typeof RencanaStrategi,
  ) {}

  create(body: CreateRencanaStrategiDto) {
    return this.rencanaStategiModel.create({ ...body });
  }

  async findAll(params: GetAllRencanaStrategiDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, RencanaStrategiScope);

    if (params.submit_by) where.submit_by = params.submit_by;
    if (typeof params.status === "boolean") where.is_active = params.status;
    if (params.prodi) where["$user_submit.prodi.name$"] = { [Op.iLike]: `%${params.prodi}%` };
    if (params.tahun) where.tahun = params.tahun;
    if (params.keyword) {
      where = {
        [Op.or]: [
          { sasaran: { [Op.iLike]: `%${params.keyword}%` } },
          { tujuan: { [Op.iLike]: `%${params.keyword}%` } },
        ],
      };
    }

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.rencanaStategiModel.findAll({ where, limit, offset, order, include }),
      this.rencanaStategiModel.count({ where, include }),
      this.rencanaStategiModel.count(),
    ]);

    data.forEach((item) => {
      item.setDataValue("status", VerificationStatusReverse[item.status]);
    });

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.rencanaStategiModel.findByPk(id, { include: RencanaStrategiScope.all });
  }

  async filter() {
    const data = await this.rencanaStategiModel.findAll({ group: "tahun", attributes: ["tahun"] });

    const res = {};
    data.map((item) => (res[item.tahun] = true));

    return { tahun: Object.keys(res) };
  }

  async update(id: number, body: UpdateRencanaStrategiDto) {
    const check = await this.rencanaStategiModel.findByPk(id, { raw: true });
    if (!check) {
      throw new HttpException(HttpMessage.notFound, HttpStatus.NOT_FOUND);
    }

    const mock: Record<string, any> = {};
    Object.keys(body).map((key) => {
      if (isNotEmpty(body[key])) mock[key] = body[key];
    });

    const data = await this.rencanaStategiModel.update(mock, { where: { id }, returning: true });

    return data[1][0];
  }

  remove(id: number) {
    return this.rencanaStategiModel.destroy({ where: { id } });
  }
}
