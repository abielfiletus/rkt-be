import { BelongsTo, Column, DataType, Index, Model, Table } from "sequelize-typescript";
import { VerificationStatus } from "../../../common";
import { PenyusunanRkt } from "../../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { User } from "../../user/entities/user.entity";

@Table({ freezeTableName: true })
export class RktNoteHistory extends Model {
  @Index("rkt_index")
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rkt_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.CHAR(1),
    allowNull: false,
  })
  status: VerificationStatus;

  @Column({
    type: DataType.STRING,
  })
  note: string;

  @BelongsTo(() => PenyusunanRkt, "rkt_id")
  rkt: PenyusunanRkt;

  @BelongsTo(() => User, "user_id")
  user: User;
}
