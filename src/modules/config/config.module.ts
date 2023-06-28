import { Module } from "@nestjs/common";
import { ConfigService } from "./config.service";
import { ConfigController } from "./config.controller";
import { Config } from "./entities/config.entity";

@Module({
  controllers: [ConfigController],
  providers: [ConfigService, { provide: Config.name, useValue: Config }],
})
export class ConfigurationModule {}
