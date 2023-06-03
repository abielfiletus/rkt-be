import { Test, TestingModule } from "@nestjs/testing";
import { CapaianService } from "./capaian.service";

describe("CapaianService", () => {
  let service: CapaianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapaianService],
    }).compile();

    service = module.get<CapaianService>(CapaianService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
