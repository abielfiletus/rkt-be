import { Test, TestingModule } from "@nestjs/testing";
import { RktNoteHistoryController } from "./rkt-note-history.controller";
import { RktNoteHistoryService } from "./rkt-note-history.service";

describe("RktNoteHistoryController", () => {
  let controller: RktNoteHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RktNoteHistoryController],
      providers: [RktNoteHistoryService],
    }).compile();

    controller = module.get<RktNoteHistoryController>(RktNoteHistoryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
