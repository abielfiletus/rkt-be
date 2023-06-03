import { Inject, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-department.dto";
import { UpdateRoleDto } from "./dto/update-department.dto";
import { Department } from "./entities/department.entity";
import { GetAllDepartmentDto } from "./dto/get-all-department.dto";
import { prepareQuery } from "../../util";

@Injectable()
export class DepartmentService {
  constructor(@Inject(Department.name) private readonly departmentModel: typeof Department) {}

  create(body: CreateRoleDto) {
    return this.departmentModel.create({ ...body });
  }

  async findAll(params: GetAllDepartmentDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, {});

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.departmentModel.findAll({ where, limit, offset, order, include }),
      this.departmentModel.count({ where, include }),
      this.departmentModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.departmentModel.findByPk(id);
  }

  update(id: number, body: UpdateRoleDto) {
    return this.departmentModel.update({ name: body.name }, { where: { id } });
  }

  remove(id: number) {
    return this.departmentModel.destroy({ where: { id } });
  }
}
