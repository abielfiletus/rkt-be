import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [UserController],
  providers: [UserService, { provide: User.name, useValue: User }, JwtService],
  exports: [UserService],
})
export class UserModule {}
