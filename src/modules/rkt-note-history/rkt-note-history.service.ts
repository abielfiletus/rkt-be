import { Inject, Injectable } from "@nestjs/common";
import { CreateRktNoteHistoryDto } from "./dto/create-rkt-note-history.dto";
import { UpdateRktNoteHistoryDto } from "./dto/update-rkt-note-history.dto";
import { RktNoteHistory } from "./entities/rkt-note-history.entity";
import { User } from "../user/entities/user.entity";
import { Role } from "../role/entities/role.entity";

@Injectable()
export class RktNoteHistoryService {
  constructor(
    @Inject(RktNoteHistory.name)
    private readonly rktHistoryModel: typeof RktNoteHistory,
  ) {}

  create(body: CreateRktNoteHistoryDto) {
    return body;
  }

  findAll() {
    return `This action returns all rktNoteHistory`;
  }

  byRkt(rkt_id) {
    return this.rktHistoryModel.findAll({
      where: { rkt_id },
      include: { model: User, attributes: { exclude: ["password"] }, include: [{ model: Role }] },
      order: [["createdAt", "desc"]],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} rktNoteHistory`;
  }

  update(id: number, body: UpdateRktNoteHistoryDto) {
    return `This action updates a #${id} rktNoteHistory ${JSON.stringify(body)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} rktNoteHistory`;
  }
}
