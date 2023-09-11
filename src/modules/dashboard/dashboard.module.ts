import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { PenyusunanRkt } from "../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { ThirdPartyModule } from "../third-party/third-party.module";
import { Prodi } from "../prodi/entities/prodi.entity";

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    { provide: PenyusunanRkt.name, useValue: PenyusunanRkt },
    { provide: Prodi.name, useValue: Prodi },
  ],
  imports: [ThirdPartyModule],
})
export class DashboardModule {}
