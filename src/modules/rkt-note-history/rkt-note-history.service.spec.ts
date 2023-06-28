import { Test, TestingModule } from "@nestjs/testing";
import { RktNoteHistoryService } from "./rkt-note-history.service";

describe("RktNoteHistoryService", () => {
  let service: RktNoteHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RktNoteHistoryService],
    }).compile();

    service = module.get<RktNoteHistoryService>(RktNoteHistoryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
