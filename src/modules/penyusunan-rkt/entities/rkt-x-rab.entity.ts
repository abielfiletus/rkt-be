import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { PenyusunanRkt } from "./penyusunan-rkt.entity";

@Table({ freezeTableName: true })
export class RktXRab extends Model {
  @ForeignKey(() => PenyusunanRkt)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rkt_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(40),
    allowNull: false,
  })
  unit: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @BelongsTo(() => PenyusunanRkt, "rkt_id")
  rkt: PenyusunanRkt;
}
