import { Injectable } from "@nestjs/common";
import { CreateLoggingDto } from "./dto/create-logging.dto";
import { UpdateLoggingDto } from "./dto/update-logging.dto";

@Injectable()
export class LoggingService {
  create(createLoggingDto: CreateLoggingDto) {
    return "This action adds a new logging";
  }

  findAll() {
    return `This action returns all logging`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logging`;
  }

  update(id: number, updateLoggingDto: UpdateLoggingDto) {
    return `This action updates a #${id} logging`;
  }

  remove(id: number) {
    return `This action removes a #${id} logging`;
  }
}
