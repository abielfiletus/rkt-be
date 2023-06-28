import { Controller, Get, Param } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "../../common";

@ApiTags("Dashboard")
@Controller("dashboard")
@ApiBearerAuth()
@Public(false)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("total-rkt")
  totalRkt() {
    return this.dashboardService.totalRkt();
  }

  @Get("rkt-by-status/:tahun")
  rktByStatus(@Param("tahun") tahun: string) {
    return this.dashboardService.rktByStatus(tahun);
  }

  @Get("rkt-by-capaian/:tahun")
  rktByCapaian(@Param("tahun") tahun: string) {
    return this.dashboardService.rktByCapaian(tahun);
  }

  @Get("mahasiswa-aktif")
  mahasiswaAktif() {
    return this.dashboardService.mahasiswaAktif();
  }

  @Get("mahasiswa-wisuda")
  pendaftaranWisuda() {
    return this.dashboardService.pendaftaranWisuda();
  }

  @Get("mahasiswa-cuti")
  mahasiswaCuti() {
    return this.dashboardService.mahasiswaCuti();
  }

  @Get("mahasiswa-do")
  mahasiswaDo() {
    return this.dashboardService.mahasiswaDo();
  }

  @Get("mahasiswa-aktif-prodi/:tahun")
  mahasiswaAktifProdi(@Param("tahun") tahun: string) {
    return this.dashboardService.mahasiswaAktifProdi(tahun);
  }

  @Get("mahasiswa-aktif-prodi-by-status/:tahun")
  mahasiswaAktifProdiByStatus(@Param("tahun") tahun: string) {
    return this.dashboardService.mahasiswaAktifProdiByStatus(tahun);
  }
}
