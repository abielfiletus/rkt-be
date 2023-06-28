import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ freezeTableName: true, paranoid: true })
export class Config extends Model {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    unique: true,
  })
  key: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  status: boolean;
}
