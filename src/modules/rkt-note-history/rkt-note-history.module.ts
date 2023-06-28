import { Module } from "@nestjs/common";
import { RktNoteHistoryService } from "./rkt-note-history.service";
import { RktNoteHistoryController } from "./rkt-note-history.controller";
import { RktNoteHistory } from "./entities/rkt-note-history.entity";

@Module({
  controllers: [RktNoteHistoryController],
  providers: [RktNoteHistoryService, { provide: RktNoteHistory.name, useValue: RktNoteHistory }],
})
export class RktNoteHistoryModule {}
