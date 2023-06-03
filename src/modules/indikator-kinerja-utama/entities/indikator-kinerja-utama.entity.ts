import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";

@Table({ freezeTableName: true, paranoid: true })
export class IndikatorKinerjaUtama extends Model {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  no: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  created_by: number;

  @BelongsTo(() => User, "created_by")
  user_create: User;
}

export const IndikatorKinerjaUtamaScope = {
  all: [{ model: User, as: "user_create", attributes: { exclude: ["password"] } }],
};
