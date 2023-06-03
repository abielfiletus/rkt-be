import { Test, TestingModule } from "@nestjs/testing";
import { PenyusunanRktService } from "./penyusunan-rkt.service";

describe("PenyusunanRktService", () => {
  let service: PenyusunanRktService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PenyusunanRktService],
    }).compile();

    service = module.get<PenyusunanRktService>(PenyusunanRktService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
