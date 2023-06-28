import { PartialType } from "@nestjs/mapped-types";
import { CreateRktNoteHistoryDto } from "./create-rkt-note-history.dto";

export class UpdateRktNoteHistoryDto extends PartialType(CreateRktNoteHistoryDto) {}
