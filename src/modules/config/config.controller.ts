import { Controller, Get, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { UpdateConfigDto } from "./dto/update-config.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetAllConfigDto } from "./dto/get-all-config.dto";

@ApiTags("Config")
@ApiBearerAuth()
@Controller("config")
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  findAll(@Query() query: GetAllConfigDto) {
    return this.configService.findAll(query);
  }

  @Get("by-key/:key")
  findByKey(@Param("key") key: string) {
    return this.configService.findByKey(key);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.configService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProdiDto: UpdateConfigDto) {
    return this.configService.update(+id, updateProdiDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.configService.remove(+id);
  }
}
