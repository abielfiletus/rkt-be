import { Transaction } from "sequelize";

export interface CreateCapaianDto {
  rkt_id: number;
  iku_data: Array<number>;
  trx: Transaction;
}
