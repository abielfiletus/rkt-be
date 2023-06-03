import { Test, TestingModule } from "@nestjs/testing";
import { PerjanjianKerjaService } from "./perjanjian-kerja.service";

describe("PerjanjianKerjaService", () => {
  let service: PerjanjianKerjaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerjanjianKerjaService],
    }).compile();

    service = module.get<PerjanjianKerjaService>(PerjanjianKerjaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
