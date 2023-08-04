import { Module } from "@nestjs/common";
import { CapaianService } from "./capaian.service";
import { CapaianController } from "./capaian.controller";
import { Capaian } from "./entities/capaian.entity";
import { CapaianXIku } from "./entities/capaian-x-iku";
import { PenyusunanRkt } from "../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { PerjanjianKerja } from "../perjanjian-kerja/entities/perjanjian-kerja.entity";

@Module({
  controllers: [CapaianController],
  providers: [
    CapaianService,
    { provide: Capaian.name, useValue: Capaian },
    { provide: CapaianXIku.name, useValue: CapaianXIku },
    { provide: PenyusunanRkt.name, useValue: PenyusunanRkt },
    { provide: PerjanjianKerja.name, useValue: PerjanjianKerja },
  ],
  exports: [CapaianService],
})
export class CapaianModule {}
