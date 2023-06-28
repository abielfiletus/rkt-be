import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, GetAllUserDto, LoginDto, UpdateUserDto } from "./dto";
import { Public } from "../../common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import * as fileType from "file-type";

@ApiTags("User")
@ApiBearerAuth()
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiConsumes("multipart/form-data")
  @Post()
  async create(@Body() body: CreateUserDto) {
    if (body.avatar) {
      body.avatar = { file: body.avatar, ...(await fileType.fromBuffer(body.avatar as Buffer)) };
    }

    let data = await this.userService.create(body);
    data = data.toJSON();

    delete data.password;
    return data;
  }

  @Public()
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.userService.validateLogin(body);
  }

  @Public(false)
  @Get("permissions")
  permissions(@Req() req: Record<string, any>) {
    return this.userService.permissions(req.user?.role_id);
  }

  @Get()
  findAll(@Query() query: GetAllUserDto) {
    return this.userService.findAll(query);
  }

  @Public(false)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @ApiConsumes("multipart/form-data")
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    if (body.avatar) {
      body.avatar = { file: body.avatar, ...(await fileType.fromBuffer(body.avatar as Buffer)) };
    }

    const data = await this.userService.update(+id, body);

    if (data[1]) data[1][0]?.setDataValue("password", "");
    return data[1] ? data[1][0] : null;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
