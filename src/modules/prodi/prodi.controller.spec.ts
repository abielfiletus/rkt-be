import { Test, TestingModule } from "@nestjs/testing";
import { ProdiController } from "./prodi.controller";
import { ProdiService } from "./prodi.service";

describe("ProdiController", () => {
  let controller: ProdiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdiController],
      providers: [ProdiService],
    }).compile();

    controller = module.get<ProdiController>(ProdiController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
