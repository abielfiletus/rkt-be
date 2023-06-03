import { Controller, Get, Param } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Dashboard")
@Controller("dashboard")
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dashboardService.findOne(+id);
  }
}
