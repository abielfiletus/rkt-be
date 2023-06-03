import { Module } from "@nestjs/common";
import { UserModule } from "./modules/user/user.module";
import { DatabaseModule } from "./common/database/database.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtAuthGuard, ResponseInterceptor, RolesGuard } from "./common";
import { PermissionModule } from "./modules/permission/permission.module";
import { ProdiModule } from "./modules/prodi/prodi.module";
import { JwtStrategy } from "./common/guard/jwt.strategy";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { FileModule } from "./modules/file/file.module";
import { RencanaStrategisModule } from "./modules/rencana-strategis/rencana-strategis.module";
import { IndikatorKinerjaUtamaModule } from "./modules/indikator-kinerja-utama/indikator-kinerja-utama.module";
import { PenyusunanRktModule } from "./modules/penyusunan-rkt/penyusunan-rkt.module";
import { PerjanjianKerjaModule } from "./modules/perjanjian-kerja/perjanjian-kerja.module";
import { RoleModule } from "./modules/role/role.module";
import { DepartmentModule } from "./modules/department/department.module";

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    PermissionModule,
    ProdiModule,
    FileModule,
    RencanaStrategisModule,
    IndikatorKinerjaUtamaModule,
    PenyusunanRktModule,
    PerjanjianKerjaModule,
    RoleModule,
    DepartmentModule,
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV ? process.cwd() + "/" + process.env.NODE_ENV : ""}.env`,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DB_DIALECT: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        SALT_ROUND: Joi.number().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d", noTimestamp: true },
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
  ].sort(),
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
