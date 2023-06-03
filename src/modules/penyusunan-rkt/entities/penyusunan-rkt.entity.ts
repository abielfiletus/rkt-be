import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { RencanaStrategi } from "../../rencana-strategis/entities/rencana-strategi.entity";
import { RktXIku } from "./rkt-x-iku.entity";
import { RktXRab } from "./rkt-x-rab.entity";
import { IkuXAksi } from "./iku-x-aksi.entity";
import { User } from "../../user/entities/user.entity";
import { VerificationStatus } from "../../../common";

@Table({ freezeTableName: true })
export class PenyusunanRkt extends Model {
  @Column({
    type: DataType.CHAR(4),
    allowNull: false,
  })
  tahun: string;

  @ForeignKey(() => RencanaStrategi)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rencana_strategi_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  satuan_kerja: string;

  @Column({
    type: DataType.STRING(40),
    allowNull: false,
  })
  target_perjanjian_kerja: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  usulan_anggaran: number;

  @Column({
    type: DataType.STRING,
  })
  kak: string;

  @Column({
    type: DataType.STRING,
  })
  referensi_harga: string;

  @Column({
    type: DataType.STRING,
  })
  pendukung: string;

  @Column({
    type: DataType.ENUM("0", "1", "2", "3", "4"),
    defaultValue: VerificationStatus.pending,
  })
  status: VerificationStatus;

  @Column({
    type: DataType.STRING,
  })
  notes: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  submit_by: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  verified_by: number;

  @BelongsTo(() => User, "submit_by")
  user_submit: User;

  @BelongsTo(() => User, "verified_by")
  user_verified: User;

  @BelongsTo(() => RencanaStrategi, "rencana_strategi_id")
  rencana_strategi: RencanaStrategi;

  @HasMany(() => RktXIku, "rkt_id")
  rkt_x_iku: RktXIku[];

  @HasMany(() => RktXRab, "rkt_id")
  rkt_x_rab: RktXRab[];
}

export const PenyusunanRktScope = {
  all: [
    { model: User, as: "user_submit", attributes: { exclude: ["password"] } },
    { model: User, as: "user_verified", attributes: { exclude: ["password"] } },
    { model: RencanaStrategi, as: "rencana_strategi" },
    { model: RktXIku, as: "rkt_x_iku", include: [{ model: IkuXAksi, as: "iku_x_aksi" }] },
    { model: RktXRab, as: "rkt_x_rab" },
  ],
  user_submit: [{ model: User, as: "user_submit", attributes: { exclude: ["password"] } }],
  rencana_strategi: [{ model: RencanaStrategi, as: "rencana_strategi" }],
};
