import { Injectable } from "@nestjs/common";
import { CreateCapaianDto } from "./dto/create-capaian.dto";
import { UpdateCapaianDto } from "./dto/update-capaian.dto";

@Injectable()
export class CapaianService {
  create(createCapaianDto: CreateCapaianDto) {
    return "This action adds a new capaian";
  }

  findAll() {
    return `This action returns all capaian`;
  }

  findOne(id: number) {
    return `This action returns a #${id} capaian`;
  }

  update(id: number, updateCapaianDto: UpdateCapaianDto) {
    return `This action updates a #${id} capaian`;
  }

  remove(id: number) {
    return `This action removes a #${id} capaian`;
  }
}
