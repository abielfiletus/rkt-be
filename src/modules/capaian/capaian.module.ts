import { Module } from "@nestjs/common";
import { CapaianService } from "./capaian.service";
import { CapaianController } from "./capaian.controller";

@Module({
  controllers: [CapaianController],
  providers: [CapaianService],
})
export class CapaianModule {}
