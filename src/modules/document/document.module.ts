import { Module } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { DocumentController } from "./document.controller";
import { Document } from "./entities/document.entity";

@Module({
  controllers: [DocumentController],
  providers: [DocumentService, { provide: Document.name, useValue: Document }],
  exports: [DocumentService],
})
export class DocumentModule {}
