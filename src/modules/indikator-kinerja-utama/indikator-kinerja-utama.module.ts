import { Module } from "@nestjs/common";
import { IndikatorKinerjaUtamaService } from "./indikator-kinerja-utama.service";
import { IndikatorKinerjaUtamaController } from "./indikator-kinerja-utama.controller";
import { IndikatorKinerjaUtama } from "./entities/indikator-kinerja-utama.entity";

@Module({
  controllers: [IndikatorKinerjaUtamaController],
  providers: [
    IndikatorKinerjaUtamaService,
    { provide: IndikatorKinerjaUtama.name, useValue: IndikatorKinerjaUtama },
  ],
})
export class IndikatorKinerjaUtamaModule {}
