import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class Module extends Model {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
  })
  order: number;
}
