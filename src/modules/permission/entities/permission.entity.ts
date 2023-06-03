import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Role } from "../../role/entities/role.entity";
import { Module } from "../../module/entities/module.entity";

@Table({ freezeTableName: true })
export class Permission extends Model {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  role_id: string;

  @BelongsTo(() => Role, "role_id")
  role: Role;

  @ForeignKey(() => Module)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  module_id: string;

  @BelongsTo(() => Module, "module_id")
  module: Module;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  Create: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  Read: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  Update: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  Delete: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  Approve: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  Download: boolean;
}
