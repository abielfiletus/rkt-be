import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { RktXIku } from "./rkt-x-iku.entity";
import { RktXRab } from "./rkt-x-rab.entity";
import { IkuXAksi } from "./iku-x-aksi.entity";
import { User } from "../../user/entities/user.entity";
import { VerificationStatus } from "../../../common";
import { Role } from "../../role/entities/role.entity";
import { IndikatorKinerjaUtama } from "../../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";

@Table({ freezeTableName: true })
export class PenyusunanRkt extends Model {
  @Column({
    type: DataType.STRING(50),
  })
  no_pengajuan: string;

  @Column({
    type: DataType.CHAR(4),
    allowNull: false,
  })
  tahun: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

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
  surat_usulan: string;

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
    type: DataType.CHAR(1),
    defaultValue: VerificationStatus.on_verification,
  })
  status: VerificationStatus;

  @Column({ type: DataType.INTEGER })
  verification_role_target: number;

  @Column({ type: DataType.JSONB })
  history: Record<string, any>;

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

  @BelongsTo(() => Role, "verification_role_target")
  verification_role: Role;

  @BelongsTo(() => User, "submit_by")
  user_submit: User;

  @BelongsTo(() => User, "verified_by")
  user_verified: User;

  @HasMany(() => RktXIku, "rkt_id")
  rkt_x_iku: RktXIku[];

  @HasMany(() => RktXRab, "rkt_id")
  rkt_x_rab: RktXRab[];
}

export const PenyusunanRktScope = {
  all: [
    { model: User, as: "user_submit", attributes: { exclude: ["password"] } },
    { model: User, as: "user_verified", attributes: { exclude: ["password"] } },
    {
      model: RktXIku,
      as: "rkt_x_iku",
      include: [
        { model: IkuXAksi, as: "iku_x_aksi" },
        { model: IndikatorKinerjaUtama, as: "iku", required: true },
      ],
    },
    { model: RktXRab, as: "rkt_x_rab" },
    { model: Role, as: "verification_role" },
  ],
  user_submit: [
    { model: User, as: "user_submit", attributes: { exclude: ["password"] } },
    { model: Role, as: "verification_role" },
  ],
  iku: {
    model: RktXIku,
    as: "rkt_x_iku",
    include: [
      { model: IkuXAksi, as: "iku_x_aksi" },
      { model: IndikatorKinerjaUtama, as: "iku", required: true },
    ],
  },
};
