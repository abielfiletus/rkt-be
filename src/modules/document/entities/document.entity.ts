import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ freezeTableName: true })
export class Document extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.STRING,
  })
  file: string;
}
