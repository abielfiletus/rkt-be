import { Test, TestingModule } from "@nestjs/testing";
import { RencanaStrategisController } from "./rencana-strategis.controller";
import { RencanaStrategisService } from "./rencana-strategis.service";

describe("RencanaStrategisController", () => {
  let controller: RencanaStrategisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RencanaStrategisController],
      providers: [RencanaStrategisService],
    }).compile();

    controller = module.get<RencanaStrategisController>(RencanaStrategisController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
