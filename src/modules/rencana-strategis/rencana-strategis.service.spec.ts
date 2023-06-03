import { Test, TestingModule } from "@nestjs/testing";
import { RencanaStrategisService } from "./rencana-strategis.service";

describe("RencanaStrategisService", () => {
  let service: RencanaStrategisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RencanaStrategisService],
    }).compile();

    service = module.get<RencanaStrategisService>(RencanaStrategisService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
