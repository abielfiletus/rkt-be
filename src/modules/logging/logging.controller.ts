import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { LoggingService } from "./logging.service";
import { CreateLoggingDto } from "./dto/create-logging.dto";
import { UpdateLoggingDto } from "./dto/update-logging.dto";

@Controller("logging")
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Post()
  create(@Body() createLoggingDto: CreateLoggingDto) {
    return this.loggingService.create(createLoggingDto);
  }

  @Get()
  findAll() {
    return this.loggingService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.loggingService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateLoggingDto: UpdateLoggingDto) {
    return this.loggingService.update(+id, updateLoggingDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.loggingService.remove(+id);
  }
}
