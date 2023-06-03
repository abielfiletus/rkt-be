import { Module } from "@nestjs/common";
import { PerjanjianKerjaService } from "./perjanjian-kerja.service";
import { PerjanjianKerjaController } from "./perjanjian-kerja.controller";
import { PerjanjianKerja } from "./entities/perjanjian-kerja.entity";
import { PenyusunanRkt } from "../penyusunan-rkt/entities/penyusunan-rkt.entity";

@Module({
  controllers: [PerjanjianKerjaController],
  providers: [
    PerjanjianKerjaService,
    { provide: PerjanjianKerja.name, useValue: PerjanjianKerja },
    { provide: PenyusunanRkt.name, useValue: PenyusunanRkt },
  ],
  exports: [PerjanjianKerjaService],
})
export class PerjanjianKerjaModule {}
