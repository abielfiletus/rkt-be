import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { PenyusunanRkt } from "./penyusunan-rkt.entity";
import { IndikatorKinerjaUtama } from "../../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";
import { IkuXAksi } from "./iku-x-aksi.entity";

@Table({ freezeTableName: true })
export class RktXIku extends Model {
  @ForeignKey(() => PenyusunanRkt)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rkt_id: number;

  @ForeignKey(() => IndikatorKinerjaUtama)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  iku_id: number;

  @BelongsTo(() => PenyusunanRkt, "rkt_id")
  rkt: PenyusunanRkt;

  @HasMany(() => IkuXAksi, "rkt_x_iku_id")
  iku_x_aksi: IkuXAksi[];
}
