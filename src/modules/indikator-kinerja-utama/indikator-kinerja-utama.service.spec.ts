import { Test, TestingModule } from "@nestjs/testing";
import { IndikatorKinerjaUtamaService } from "./indikator-kinerja-utama.service";

describe("IndikatorKinerjaUtamaService", () => {
  let service: IndikatorKinerjaUtamaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndikatorKinerjaUtamaService],
    }).compile();

    service = module.get<IndikatorKinerjaUtamaService>(IndikatorKinerjaUtamaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
