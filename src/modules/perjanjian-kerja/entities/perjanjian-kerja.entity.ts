import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { PenyusunanRkt } from "../../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { VerificationStatus } from "../../../common";
import { User } from "../../user/entities/user.entity";
import { RktXIku } from "../../penyusunan-rkt/entities/rkt-x-iku.entity";
import { IkuXAksi } from "../../penyusunan-rkt/entities/iku-x-aksi.entity";
import { IndikatorKinerjaUtama } from "../../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";

@Table({ freezeTableName: true })
export class PerjanjianKerja extends Model {
  @ForeignKey(() => PenyusunanRkt)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rkt_id: number;

  @Column({
    type: DataType.STRING,
  })
  perjanjian_kerja: string;

  @Column({
    type: DataType.CHAR(1),
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

  @BelongsTo(() => PenyusunanRkt)
  rkt: PenyusunanRkt;

  @BelongsTo(() => User, "submit_by")
  user_submit: User;

  @BelongsTo(() => User, "verified_by")
  user_verified: User;
}

export const PerjanjianKerjaScope = {
  all: [
    { model: User, as: "user_submit", attributes: { exclude: ["password"] }, required: true },
    { model: User, as: "user_verified", attributes: { exclude: ["password"] } },
    {
      model: PenyusunanRkt,
      as: "rkt",
      required: true,
      include: [
        {
          model: RktXIku,
          as: "rkt_x_iku",
          attributes: [],
          include: [
            { model: IkuXAksi, as: "iku_x_aksi", attributes: [] },
            { model: IndikatorKinerjaUtama, as: "iku", attributes: [], required: true },
          ],
        },
      ],
    },
  ],
  rkt: [{ model: PenyusunanRkt, as: "rkt", required: true }],
  user_submit: [
    { model: User, as: "user_submit", attributes: { exclude: ["password"] }, required: true },
  ],
};
