import { Test, TestingModule } from "@nestjs/testing";
import { PenyusunanRktController } from "./penyusunan-rkt.controller";
import { PenyusunanRktService } from "./penyusunan-rkt.service";

describe("PenyusunanRktController", () => {
  let controller: PenyusunanRktController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenyusunanRktController],
      providers: [PenyusunanRktService],
    }).compile();

    controller = module.get<PenyusunanRktController>(PenyusunanRktController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
