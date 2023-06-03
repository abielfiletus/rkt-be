import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { RktXIku } from "./rkt-x-iku.entity";
import { PenyusunanRkt } from "./penyusunan-rkt.entity";

@Table({ freezeTableName: true })
export class IkuXAksi extends Model {
  @ForeignKey(() => PenyusunanRkt)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rkt_id: number;

  @ForeignKey(() => RktXIku)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rkt_x_iku_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  rencana_aksi: string;

  @Column({
    type: DataType.INTEGER,
  })
  tw_1: number;

  @Column({
    type: DataType.INTEGER,
  })
  tw_2: number;

  @Column({
    type: DataType.INTEGER,
  })
  tw_3: number;

  @Column({
    type: DataType.INTEGER,
  })
  tw_4: number;

  @Column({
    type: DataType.INTEGER,
  })
  total: number;

  @BelongsTo(() => RktXIku, "rkt_x_iku_id")
  rkt_x_iku: RktXIku;
}
