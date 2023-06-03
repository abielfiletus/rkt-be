import { Module } from "@nestjs/common";
import { RencanaStrategisService } from "./rencana-strategis.service";
import { RencanaStrategisController } from "./rencana-strategis.controller";
import { RencanaStrategi } from "./entities/rencana-strategi.entity";

@Module({
  controllers: [RencanaStrategisController],
  providers: [
    RencanaStrategisService,
    { provide: RencanaStrategi.name, useValue: RencanaStrategi },
  ],
})
export class RencanaStrategisModule {}
