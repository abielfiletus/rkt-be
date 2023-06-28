import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { AkademikService } from "./akademik.service";

@Module({
  imports: [HttpModule.register({ timeout: 30000 })],
  providers: [AkademikService],
  exports: [AkademikService],
})
export class ThirdPartyModule {}
