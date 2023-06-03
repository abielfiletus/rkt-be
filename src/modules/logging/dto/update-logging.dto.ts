import { PartialType } from "@nestjs/mapped-types";
import { CreateLoggingDto } from "./create-logging.dto";

export class UpdateLoggingDto extends PartialType(CreateLoggingDto) {}
