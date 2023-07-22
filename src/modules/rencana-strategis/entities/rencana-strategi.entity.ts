import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { VerificationStatus } from "../../../common";
import { User, UserScopes } from "../../user/entities/user.entity";

@Table({ freezeTableName: true, paranoid: true })
export class RencanaStrategi extends Model {
  @Column({
    type: DataType.CHAR(4),
    allowNull: false,
  })
  tahun: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  visi: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  misi: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  tujuan: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sasaran: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.CHAR(1),
    defaultValue: VerificationStatus.pending,
  })
  status: VerificationStatus;

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
}

export const RencanaStrategiScope = {
  all: [
    {
      model: User,
      as: "user_submit",
      attributes: { exclude: ["password"] },
      include: UserScopes.prodi,
    },
    {
      model: User,
      as: "user_verified",
      attributes: { exclude: ["password"] },
    },
  ],
  user_submit: [
    {
      model: User,
      as: "user_submit",
      attributes: { exclude: ["password"] },
      include: UserScopes.prodi,
    },
  ],
  user_verified: [
    {
      model: User,
      as: "user_verified",
      attributes: { exclude: ["password"] },
      include: UserScopes.prodi,
    },
  ],
};
