import { Module } from "@nestjs/common";
import { PenyusunanRktService } from "./penyusunan-rkt.service";
import { PenyusunanRktController } from "./penyusunan-rkt.controller";
import { PenyusunanRkt } from "./entities/penyusunan-rkt.entity";
import { IkuXAksi } from "./entities/iku-x-aksi.entity";
import { RktXIku } from "./entities/rkt-x-iku.entity";
import { RktXRab } from "./entities/rkt-x-rab.entity";
import { IndikatorKinerjaUtama } from "../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";
import { PerjanjianKerja } from "../perjanjian-kerja/entities/perjanjian-kerja.entity";

@Module({
  controllers: [PenyusunanRktController],
  providers: [
    PenyusunanRktService,
    { provide: PenyusunanRkt.name, useValue: PenyusunanRkt },
    { provide: IkuXAksi.name, useValue: IkuXAksi },
    { provide: RktXIku.name, useValue: RktXIku },
    { provide: RktXRab.name, useValue: RktXRab },
    { provide: IndikatorKinerjaUtama.name, useValue: IndikatorKinerjaUtama },
    { provide: PerjanjianKerja.name, useValue: PerjanjianKerja },
  ],
})
export class PenyusunanRktModule {}
