import { Test, TestingModule } from "@nestjs/testing";
import { IndikatorKinerjaUtamaController } from "./indikator-kinerja-utama.controller";
import { IndikatorKinerjaUtamaService } from "./indikator-kinerja-utama.service";

describe("IndikatorKinerjaUtamaController", () => {
  let controller: IndikatorKinerjaUtamaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndikatorKinerjaUtamaController],
      providers: [IndikatorKinerjaUtamaService],
    }).compile();

    controller = module.get<IndikatorKinerjaUtamaController>(IndikatorKinerjaUtamaController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
