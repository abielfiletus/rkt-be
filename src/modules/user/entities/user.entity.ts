import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Role } from "../../role/entities/role.entity";
import { Prodi } from "../../prodi/entities/prodi.entity";
import { Department } from "../../department/entities/department.entity";

@Table({ freezeTableName: true, paranoid: true })
export class User extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  nip: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({ type: DataType.CHAR(3) })
  kode_prodi: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id: number;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  department_id: number;

  @Column({
    type: DataType.STRING,
  })
  avatar: string;

  @BelongsTo(() => Role, "role_id")
  role: Role;

  @BelongsTo(() => Department, "department_id")
  department: Department;

  @BelongsTo(() => Prodi, { foreignKey: "kode_prodi", targetKey: "kode_prodi" })
  prodi: Prodi;
}

export const UserScopes = {
  all: [
    { model: Role, as: "role" },
    { model: Prodi, as: "prodi" },
    { model: Department, as: "department" },
  ],
  prodi: [{ model: Prodi, as: "prodi" }],
  role: [{ model: Role, as: "role" }],
  department: [{ model: Department, as: "department" }],
};
