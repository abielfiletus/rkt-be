import { Module } from "@nestjs/common";
import { ProdiService } from "./prodi.service";
import { ProdiController } from "./prodi.controller";
import { Prodi } from "./entities/prodi.entity";

@Module({
  controllers: [ProdiController],
  providers: [ProdiService, { provide: Prodi.name, useValue: Prodi }],
})
export class ProdiModule {}
