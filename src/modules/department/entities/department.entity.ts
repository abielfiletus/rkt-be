import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ freezeTableName: true, paranoid: true })
export class Department extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name: string;
}
