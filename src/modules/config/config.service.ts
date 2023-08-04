import { Inject, Injectable } from "@nestjs/common";
import { UpdateConfigDto } from "./dto/update-config.dto";
import { Config } from "./entities/config.entity";
import { GetAllConfigDto } from "./dto/get-all-config.dto";
import { prepareQuery } from "../../util";
import { Op } from "sequelize";

@Injectable()
export class ConfigService {
  constructor(@Inject(Config.name) private readonly configModel: typeof Config) {}

  async findAll(params: GetAllConfigDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(
      { ...params, sort_field: "id" },
      {},
    );

    if (params.name) where.name = { [Op.iLike]: `%${params.name}%` };

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.configModel.findAll({ where, limit, offset, order, include }),
      this.configModel.count({ where, include }),
      this.configModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.configModel.findByPk(id);
  }

  findByKey(key: string) {
    return this.configModel.findOne({ where: { key } });
  }

  update(id: number, body: UpdateConfigDto) {
    return this.configModel.update({ status: body.status }, { where: { id } });
  }

  remove(id: number) {
    return this.configModel.destroy({ where: { id } });
  }
}
