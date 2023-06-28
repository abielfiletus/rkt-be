import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Capaian } from "./capaian.entity";
import { IndikatorKinerjaUtama } from "../../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";

@Table({ freezeTableName: true })
export class CapaianXIku extends Model {
  @ForeignKey(() => Capaian)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  capaian_id: number;

  @ForeignKey(() => IndikatorKinerjaUtama)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  iku_id: number;

  @Column({
    type: DataType.INTEGER,
  })
  capaian_1: number;

  @Column({
    type: DataType.TEXT,
  })
  progress_1: string;

  @Column({
    type: DataType.TEXT,
  })
  masalah_1: string;

  @Column({
    type: DataType.TEXT,
  })
  strategi_1: string;

  @Column({
    type: DataType.INTEGER,
  })
  capaian_2: number;

  @Column({
    type: DataType.TEXT,
  })
  progress_2: string;

  @Column({
    type: DataType.TEXT,
  })
  masalah_2: string;

  @Column({
    type: DataType.TEXT,
  })
  strategi_2: string;

  @Column({
    type: DataType.INTEGER,
  })
  capaian_3: number;

  @Column({
    type: DataType.TEXT,
  })
  progress_3: string;

  @Column({
    type: DataType.TEXT,
  })
  masalah_3: string;

  @Column({
    type: DataType.TEXT,
  })
  strategi_3: string;

  @Column({
    type: DataType.INTEGER,
  })
  capaian_4: number;

  @Column({
    type: DataType.TEXT,
  })
  progress_4: string;

  @Column({
    type: DataType.TEXT,
  })
  masalah_4: string;

  @Column({
    type: DataType.TEXT,
  })
  strategi_4: string;

  @BelongsTo(() => Capaian)
  capaian: Capaian;

  @BelongsTo(() => IndikatorKinerjaUtama)
  iku: IndikatorKinerjaUtama;
}
