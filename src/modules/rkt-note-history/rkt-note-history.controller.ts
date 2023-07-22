import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { RktNoteHistoryService } from "./rkt-note-history.service";
import { CreateRktNoteHistoryDto } from "./dto/create-rkt-note-history.dto";
import { UpdateRktNoteHistoryDto } from "./dto/update-rkt-note-history.dto";
import { Public } from "../../common";

@Controller("rkt-note-history")
export class RktNoteHistoryController {
  constructor(private readonly rktNoteHistoryService: RktNoteHistoryService) {}

  @Post()
  create(@Body() createRktNoteHistoryDto: CreateRktNoteHistoryDto) {
    return this.rktNoteHistoryService.create(createRktNoteHistoryDto);
  }

  @Get()
  findAll() {
    return this.rktNoteHistoryService.findAll();
  }

  @Public(false)
  @Get("by-rkt/:rkt_id")
  byRkt(@Param("rkt_id") rkt_id: string) {
    return this.rktNoteHistoryService.byRkt(rkt_id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.rktNoteHistoryService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRktNoteHistoryDto: UpdateRktNoteHistoryDto) {
    return this.rktNoteHistoryService.update(+id, updateRktNoteHistoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.rktNoteHistoryService.remove(+id);
  }
}
