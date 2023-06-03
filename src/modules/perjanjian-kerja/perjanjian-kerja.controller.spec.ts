import { Test, TestingModule } from "@nestjs/testing";
import { PerjanjianKerjaController } from "./perjanjian-kerja.controller";
import { PerjanjianKerjaService } from "./perjanjian-kerja.service";

describe("PerjanjianKerjaController", () => {
  let controller: PerjanjianKerjaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerjanjianKerjaController],
      providers: [PerjanjianKerjaService],
    }).compile();

    controller = module.get<PerjanjianKerjaController>(PerjanjianKerjaController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
