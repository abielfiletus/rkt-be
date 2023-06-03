import { Inject, Injectable } from "@nestjs/common";
import { CreateProdiDto } from "./dto/create-prodi.dto";
import { UpdateProdiDto } from "./dto/update-prodi.dto";
import { Prodi } from "./entities/prodi.entity";
import { GetAllProdiDto } from "./dto/get-all-prodi.dto";
import { prepareQuery } from "../../util";
import { Op } from "sequelize";

@Injectable()
export class ProdiService {
  constructor(@Inject(Prodi.name) private readonly prodiModel: typeof Prodi) {}

  create(body: CreateProdiDto) {
    return this.prodiModel.create({ ...body });
  }

  async findAll(params: GetAllProdiDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, {});

    if (params.name) where.name = { [Op.iLike]: `%${params.name}%` };
    if (params.kode_prodi) where.kode_prodi = params.kode_prodi;

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.prodiModel.findAll({ where, limit, offset, order, include }),
      this.prodiModel.count({ where, include }),
      this.prodiModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.prodiModel.findByPk(id);
  }

  update(id: number, body: UpdateProdiDto) {
    return this.prodiModel.update(
      { name: body.name, kode_prodi: body.kode_prodi },
      { where: { id } },
    );
  }

  remove(id: number) {
    return this.prodiModel.destroy({ where: { id } });
  }
}
