import { Module } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";
import { PenyusunanRkt } from "../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { ThirdPartyModule } from "../third-party/third-party.module";

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, { provide: PenyusunanRkt.name, useValue: PenyusunanRkt }],
  imports: [ThirdPartyModule],
})
export class DashboardModule {}
