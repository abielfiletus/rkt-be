import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User, UserScopes } from "./entities/user.entity";
import { CreateUserDto, GetAllUserDto, LoginDto, UpdateUserDto } from "./dto";
import { HttpMessage, ValidationMessage } from "../../common";
import { Op } from "sequelize";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import * as fs from "fs-extra";
import { isNotEmpty, prepareQuery, RollbackFile, UploadFile } from "../../util";

@Injectable()
export class UserService {
  constructor(
    @Inject(User.name) private readonly userModel: typeof User,
    @InjectRedis() private readonly redis: Redis,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(body: CreateUserDto) {
    let file;
    try {
      const check = await this.userModel.findOne({ where: { nip: body.nip } });

      if (check) {
        throw new HttpException(
          { nip: ValidationMessage.alreadyRegistered },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      file = await this._uploadAvatar(body.avatar, body.name);
      body.avatar = file;

      body.password = bcrypt.hashSync(body.password, this.configService.get<number>("SALT_ROUND"));

      return this.userModel.create({ ...body });
    } catch (err) {
      if (file) {
        const filePath = file.path.replace(process.env.URL, "");
        if (fs.existsSync(filePath)) fs.removeSync("./" + filePath);
      }

      throw err;
    }
  }

  async findAll(params: GetAllUserDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, UserScopes);

    if (params.email) where.email = params.email;
    if (params.nip) where.nip = params.nip;
    if (params.name) where.name = { [Op.iLike]: `%${params.name}%` };
    if (params.role_id) where.role_id = params.role_id;
    if (params.keyword) {
      if (!include) include = [UserScopes.prodi];
      if (!include?.find((model) => model.as === "prodi")) include?.push(...UserScopes.prodi);

      where = {
        ...where,
        [Op.or]: [
          { name: { [Op.iLike]: `%${params.keyword}%` } },
          { email: { [Op.iLike]: `%${params.keyword}%` } },
          { nip: { [Op.iLike]: `%${params.keyword}%` } },
          { "$prodi.name$": { [Op.iLike]: `%${params.keyword}%` } },
        ],
      };
    }

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.userModel.findAll({
        where,
        limit,
        offset,
        order,
        include,
        attributes: { exclude: ["password"] },
      }),
      this.userModel.count({ where, include }),
      this.userModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.userModel.findByPk(id, {
      include: UserScopes.all,
      attributes: { exclude: ["password"] },
    });
  }

  async validateLogin(params: LoginDto) {
    const data = await this.userModel.findOne({
      where: { nip: params.nip },
      include: UserScopes.all,
    });
    if (!data) {
      throw new HttpException({ nip: ValidationMessage.notFound }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (!(await bcrypt.compare(params.password, data.password))) {
      throw new HttpException(
        { password: ValidationMessage.notMatch },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const token = this.jwtService.sign(
      {
        id: data.id,
        name: data.name,
        email: data.email,
        nip: data.nip,
        prodi: data.kode_prodi,
        role_id: data.role_id,
        role_name: data.role.name,
      },
      { secret: this.configService.get<string>("JWT_SECRET"), expiresIn: "7d" },
    );

    if (await this.redis.get(data.nip)) {
      await this.redis.del(data.nip);
    }

    await this.redis.set(data.nip, token, "EX", 7 * 3600 * 24);

    data.setDataValue("password", "");
    return { ...data.toJSON(), token };
  }

  async update(id: number, body: UpdateUserDto) {
    let file = "";
    try {
      const check = await this.userModel.findByPk(id, { raw: true });
      if (!check) {
        throw new HttpException(HttpMessage.notFound, HttpStatus.NOT_FOUND);
      }

      const mock: Record<string, any> = {};
      Object.keys(body).map((key) => {
        if (isNotEmpty(body[key])) mock[key] = body[key];
      });

      if (body.avatar) {
        file = await this._uploadAvatar(body.avatar, check.name);
        mock.avatar = file;
      }

      return this.userModel.update(mock, { where: { id }, returning: true });
    } catch (err) {
      await RollbackFile(file);
      throw err;
    }
  }

  remove(id: number) {
    return this.userModel.destroy({ where: { id } });
  }

  private async _uploadAvatar(avatar: Record<string, any>, name: string) {
    return await UploadFile({
      file: avatar.file,
      filename: name.replace(/\ /, "-") + "." + avatar.ext,
      ext: avatar.ext,
      folder: "uploads/avatar/",
      field: "avatar",
      allowedSize: "300 kb",
      allowedExt: ["jpg", "jpeg", "png"],
    });
  }
}
