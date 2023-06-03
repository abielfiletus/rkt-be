import { Inject, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./entities/role.entity";
import { GetAllRoleDto } from "./dto/get-all-role.dto";
import { prepareQuery } from "../../util";
import { Op } from "sequelize";

@Injectable()
export class RoleService {
  constructor(@Inject(Role.name) private readonly roleModel: typeof Role) {}

  create(body: CreateRoleDto) {
    return this.roleModel.create({ ...body });
  }

  async findAll(params: GetAllRoleDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, {});

    if (params.name) where.name = { [Op.iLike]: `%${params.name}%` };

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.roleModel.findAll({ where, limit, offset, order, include }),
      this.roleModel.count({ where, include }),
      this.roleModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.roleModel.findByPk(id);
  }

  update(id: number, body: UpdateRoleDto) {
    return this.roleModel.update({ name: body.name }, { where: { id } });
  }

  remove(id: number) {
    return this.roleModel.destroy({ where: { id } });
  }
}
