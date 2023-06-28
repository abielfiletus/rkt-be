import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { PenyusunanRkt } from "../../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { CapaianStatus } from "../../../common";
import { CapaianXIku } from "./capaian-x-iku";

@Table({ freezeTableName: true, paranoid: true })
export class Capaian extends Model {
  @ForeignKey(() => PenyusunanRkt)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rkt_id: number;

  @Column({
    type: DataType.CHAR(1),
    defaultValue: CapaianStatus.un_processed,
  })
  status: CapaianStatus;

  @BelongsTo(() => PenyusunanRkt, "rkt_id")
  rkt: PenyusunanRkt;

  @HasMany(() => CapaianXIku, "capaian_id")
  capaian_x_iku: CapaianXIku[];
}
