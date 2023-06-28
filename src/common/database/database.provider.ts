import { Sequelize } from "sequelize-typescript";
import { User } from "../../modules/user/entities/user.entity";
import { Role } from "../../modules/role/entities/role.entity";
import { Prodi } from "../../modules/prodi/entities/prodi.entity";
import { Dialect } from "sequelize/types/sequelize";
import { Module } from "../../modules/module/entities/module.entity";
import { Permission } from "../../modules/permission/entities/permission.entity";
import { RencanaStrategi } from "../../modules/rencana-strategis/entities/rencana-strategi.entity";
import { IndikatorKinerjaUtama } from "../../modules/indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";
import { PenyusunanRkt } from "../../modules/penyusunan-rkt/entities/penyusunan-rkt.entity";
import { RktXRab } from "../../modules/penyusunan-rkt/entities/rkt-x-rab.entity";
import { RktXIku } from "../../modules/penyusunan-rkt/entities/rkt-x-iku.entity";
import { IkuXAksi } from "../../modules/penyusunan-rkt/entities/iku-x-aksi.entity";
import { PerjanjianKerja } from "../../modules/perjanjian-kerja/entities/perjanjian-kerja.entity";
import { Department } from "../../modules/department/entities/department.entity";
import { RktNoteHistory } from "../../modules/rkt-note-history/entities/rkt-note-history.entity";
import { Document } from "../../modules/document/entities/document.entity";
import { Config } from "../../modules/config/entities/config.entity";
import { Capaian } from "../../modules/capaian/entities/capaian.entity";
import { CapaianXIku } from "../../modules/capaian/entities/capaian-x-iku";

export const databaseProviders = [
  {
    provide: "SEQUELIZE",
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: process.env.DB_DIALECT as Dialect,
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: process.env.DB_LOGGING === "true",
      });
      sequelize.addModels([
        Role,
        Prodi,
        User,
        Module,
        Permission,
        RencanaStrategi,
        IndikatorKinerjaUtama,
        PenyusunanRkt,
        RktXRab,
        RktXIku,
        IkuXAksi,
        PerjanjianKerja,
        Department,
        RktNoteHistory,
        Document,
        Config,
        Capaian,
        CapaianXIku,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
