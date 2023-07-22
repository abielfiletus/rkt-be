import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ freezeTableName: true, paranoid: true })
export class Prodi extends Model {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.CHAR(3),
    allowNull: false,
    unique: true,
  })
  kode_prodi: string;

  @Column({
    type: DataType.STRING(150),
  })
  initial: string;
}
