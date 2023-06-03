import { Test, TestingModule } from "@nestjs/testing";
import { CapaianController } from "./capaian.controller";
import { CapaianService } from "./capaian.service";

describe("CapaianController", () => {
  let controller: CapaianController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapaianController],
      providers: [CapaianService],
    }).compile();

    controller = module.get<CapaianController>(CapaianController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
