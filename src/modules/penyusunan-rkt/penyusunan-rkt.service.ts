import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePenyusunanRktDto } from "./dto/create-penyusunan-rkt.dto";
import { VerifyPenyusunanRktDto } from "./dto/verify-penyusunan-rkt.dto";
import { PenyusunanRkt, PenyusunanRktScope } from "./entities/penyusunan-rkt.entity";
import { RktXRab } from "./entities/rkt-x-rab.entity";
import { RktXIku } from "./entities/rkt-x-iku.entity";
import { IkuXAksi } from "./entities/iku-x-aksi.entity";
import { Op, Transaction } from "sequelize";
import { prepareQuery, RollbackFile, romanize, UploadFile } from "../../util";
import {
  HttpMessage,
  ValidationMessage,
  VerificationRoleStep,
  VerificationStatus,
} from "../../common";
import { IndikatorKinerjaUtama } from "../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";
import { GetAllPenyusunanRktDto } from "./dto/get-all-penyusunan-rkt.dto";
import { PerjanjianKerja } from "../perjanjian-kerja/entities/perjanjian-kerja.entity";
import { RktNoteHistory } from "../rkt-note-history/entities/rkt-note-history.entity";
import { CapaianService } from "../capaian/capaian.service";

@Injectable()
export class PenyusunanRktService {
  constructor(
    @Inject(PenyusunanRkt.name)
    private readonly rktModel: typeof PenyusunanRkt,
    @Inject(RktXRab.name)
    private readonly rktXRabModel: typeof RktXRab,
    @Inject(RktXIku.name)
    private readonly rktXIkuModel: typeof RktXIku,
    @Inject(IkuXAksi.name)
    private readonly ikuXAksiModel: typeof IkuXAksi,
    @Inject(IndikatorKinerjaUtama.name)
    private readonly ikuModel: typeof IndikatorKinerjaUtama,
    @Inject(PerjanjianKerja.name)
    private readonly pkModel: typeof PerjanjianKerja,
    @Inject(RktNoteHistory.name)
    private readonly historyModel: typeof RktNoteHistory,
    private readonly capaianService: CapaianService,
  ) {}

  async create(body: CreatePenyusunanRktDto) {
    const trx = await this.rktModel.sequelize.transaction();
    const file = [];
    try {
      const rkt = await this.rktModel.create(
        {
          tahun: body.tahun,
          name: body.name,
          target_perjanjian_kerja: body.target_perjanjian_kerja,
          usulan_anggaran: body.usulan_anggaran,
          submit_by: body.submit_by,
          status: VerificationStatus.on_verification,
          verification_role_target: 2,
        },
        { transaction: trx },
      );

      const [surat_usulan, kak, referensi_harga, pendukung] = await Promise.all([
        this._uploadFile(body.surat_usulan, "surat_usulan", "surat_usulan-" + rkt.id),
        this._uploadFile(body.kak, "kak", "kak-" + rkt.id),
        this._uploadFile(body.referensi_harga, "referensi_harga", "referensi_harga-" + rkt.id),
        this._uploadFile(body.pendukung, "pendukung", "pendukung-" + rkt.id),
      ]);

      file.push(surat_usulan);
      file.push(kak);
      file.push(referensi_harga);
      file.push(pendukung);

      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const no_pengajuan = rkt.id + "/EPB/" + romanize(month) + "/" + year;

      const [rkt_x_iku, rkt_x_rab, newRkt] = await Promise.all([
        this._createRktXIku(body.iku_data, rkt.id, trx),
        this._createRktXRab(body.rab_data, rkt.id, trx),
        this.rktModel.update(
          { surat_usulan, kak, referensi_harga, pendukung, no_pengajuan },
          { where: { id: rkt.id }, transaction: trx, returning: true },
        ),
        this.capaianService.create({
          rkt_id: rkt.id,
          iku_data: body.iku_data.map((item) => item.iku_id),
          trx,
        }),
      ]);

      await trx.commit();
      return { ...newRkt[1][0]?.toJSON(), rkt_x_iku, rkt_x_rab };
    } catch (err) {
      console.log(err);
      await trx.rollback();
      await RollbackFile(file);

      if (err?.parent?.code === "23503") {
        const detail = err.parent.detail.match(/\([a-z_]+\)/);
        throw new HttpException(
          [{ [detail[0].replace(/[\(\)]/g, "")]: ValidationMessage.notFound }],
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      throw err;
    }
  }

  async findAll(params: GetAllPenyusunanRktDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, PenyusunanRktScope);

    if (!include) include = PenyusunanRktScope.user_submit;

    if (params.tahun) where.tahun = params.tahun;
    if (params.name) where.name = { [Op.iLike]: `%${params.name}%` };
    if (params.submit_name) where["$user_submit.name$"] = params.submit_name;
    if (params.submit_id) where.submit_by = params.submit_id;
    if (params.submit_prodi) where["$user_submit.kode_prodi$"] = params.submit_prodi;
    if (params.status) where.status = params.status;

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.rktModel.findAll({ where, limit, offset, order, include }),
      this.rktModel.count({ distinct: true, where, include }),
      this.rktModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.rktModel.findByPk(id, { include: PenyusunanRktScope.all });
  }

  async filter() {
    const [tahunData, submitUserData] = await Promise.all([
      this.rktModel.findAll({ group: "tahun", attributes: ["tahun"] }),
      this.rktModel.sequelize.query(
        `SELECT u.name FROM "PenyusunanRkt" pr JOIN "User" u on pr.submit_by = u.id GROUP BY u.name`,
      ),
    ]);

    const tahun = {};
    const submitUser = {};

    tahunData.map((item) => (tahun[item.tahun] = true));
    submitUserData[0]?.map((item) => (submitUser[item["name"]] = true));

    return { tahun: Object.keys(tahun), submit_user: Object.keys(submitUser) };
  }

  async update(id: number, body: CreatePenyusunanRktDto) {
    const trx = await this.rktModel.sequelize.transaction();
    const file = [];
    try {
      const check = await this.rktModel.findByPk(id, { raw: true });

      if (!check) {
        throw new HttpException(HttpMessage.notFound, HttpStatus.NOT_FOUND);
      }

      if (![VerificationStatus.rejected, VerificationStatus.revision].includes(check.status)) {
        throw new HttpException(HttpMessage.cantUpdateCausedVerification, HttpStatus.BAD_REQUEST);
      }

      await Promise.all([
        this.rktXRabModel.destroy({ where: { rkt_id: check.id }, transaction: trx }),
        this.rktXIkuModel.destroy({ where: { rkt_id: check.id }, transaction: trx }),
        this.ikuXAksiModel.destroy({ where: { rkt_id: check.id }, transaction: trx }),
      ]);

      const mock = JSON.parse(JSON.stringify(body));
      delete mock.iku_data;
      delete mock.rab_data;

      if (body.surat_usulan) {
        const surat_usulan = await this._uploadFile(
          body.surat_usulan,
          "surat_usulan",
          "surat_usulan-" + check.id,
        );
        mock.surat_usulan = surat_usulan;
        file.push(surat_usulan);
      }
      if (body.kak) {
        const kak = await this._uploadFile(body.kak, "kak", "kak-" + check.id);
        mock.kak = kak;
        file.push(kak);
      }
      if (body.referensi_harga) {
        const referensi_harga = await this._uploadFile(
          body.referensi_harga,
          "referensi_harga",
          "referensi_harga-" + check.id,
        );
        mock.referensi_harga = referensi_harga;
        file.push(referensi_harga);
      }
      if (body.pendukung) {
        const pendukung = await this._uploadFile(
          body.pendukung,
          "pendukung",
          "pendukung-" + check.id,
        );
        mock.pendukung = pendukung;
        file.push(pendukung);
      }

      const [rkt_x_iku, rkt_x_rab, newRkt] = await Promise.all([
        this._createRktXIku(body.iku_data, check.id, trx),
        this._createRktXRab(body.rab_data, check.id, trx),
        this.rktModel.update(mock, { where: { id: check.id }, transaction: trx, returning: true }),
      ]);

      await trx.commit();
      return { ...newRkt[1][0]?.toJSON(), rkt_x_iku, rkt_x_rab };
    } catch (err) {
      await trx.rollback();
      await RollbackFile(file);
      throw err;
    }
  }

  async approval(id: number, body: VerifyPenyusunanRktDto) {
    const trx = await this.rktModel.sequelize.transaction();
    try {
      const check = await this.rktModel.findByPk(id, { raw: true });
      const status = (" " + body.status).slice(1);

      if (!check) {
        throw new HttpException(HttpMessage.notFound, HttpStatus.NOT_FOUND);
      }

      if (
        [
          VerificationStatus.rejected,
          VerificationStatus.revision,
          VerificationStatus.done,
        ].includes(check.status)
      ) {
        throw new HttpException(HttpMessage.dontNeedVerification, HttpStatus.BAD_REQUEST);
      }

      const history = check.history || { user: [], approvedAt: [] };
      let verification_role_target = check.verification_role_target;

      if (body.status === VerificationStatus.approved) {
        verification_role_target = VerificationRoleStep[Math.max(history.user.length, 1)];

        if (verification_role_target) {
          body.status = VerificationStatus.on_verification;

          history.user.push(body.verified_name);
          history.approvedAt.push(new Date().toISOString());
        } else {
          verification_role_target = null;
          body.status = VerificationStatus.done;
        }
      }

      if (body.status === VerificationStatus.rejected) {
        verification_role_target = VerificationRoleStep[0];
      }

      await this.historyModel.create(
        {
          rkt_id: check.id,
          user_id: body.verified_by,
          note: body.notes,
          status,
        },
        { transaction: trx },
      );

      const res = await this.rktModel.update(
        {
          status: body.status,
          verified_by: body.verified_by,
          notes: body.notes,
          history,
          verification_role_target,
        },
        { where: { id }, transaction: trx, returning: true },
      );

      if (body.status === VerificationStatus.done) {
        await this.pkModel.create(
          {
            rkt_id: id,
            submit_by: check.submit_by,
            status: VerificationStatus.no_action,
          },
          { transaction: trx },
        );
      }

      await trx.commit();
      return res[1][0];
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async remove(id: number) {
    const trx = await this.rktModel.sequelize.transaction();
    try {
      const res = await Promise.all([
        this.rktModel.destroy({ where: { id }, transaction: trx }),
        this.rktXRabModel.destroy({ where: { rkt_id: id }, transaction: trx }),
        this.rktXIkuModel.destroy({ where: { rkt_id: id }, transaction: trx }),
        this.ikuXAksiModel.destroy({ where: { rkt_id: id }, transaction: trx }),
        this.pkModel.destroy({ where: { rkt_id: id }, transaction: trx }),
      ]);

      await trx.commit();
      return res;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  private async _createRktXIku(data: Array<Record<string, any>>, rkt_id: number, trx: Transaction) {
    const res = [];
    await Promise.all(
      data.map(async (iku, i) => {
        if (!iku.iku_id) {
          throw new HttpException(
            { [`iku_data.${i}.iku_id`]: ValidationMessage.isNotEmpty },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        const check = await this.ikuModel.findOne({ where: { id: iku.iku_id } });

        if (!check) {
          throw new HttpException(
            { [`iku_data.${i}.iku_id`]: ValidationMessage.notFound },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
        const inserted = await this.rktXIkuModel.create(
          {
            rkt_id,
            iku_id: iku.iku_id,
            tw_1: iku.tw_1,
            tw_2: iku.tw_2,
            tw_3: iku.tw_3,
            tw_4: iku.tw_4,
            total: iku.total,
          },
          { transaction: trx },
        );

        iku.aksi_data.forEach((aksi) => {
          aksi.rkt_x_iku_id = inserted.id;
          aksi.rkt_id = rkt_id;
        });
        const aksi = await this.ikuXAksiModel.bulkCreate(iku.aksi_data as any[], {
          transaction: trx,
        });

        res.push({ ...inserted.toJSON(), rkt_x_iku: aksi });
      }),
    );

    return res;
  }

  private async _createRktXRab(data: Array<Record<string, any>>, rkt_id: number, trx: Transaction) {
    const res = [];
    await Promise.all(
      data.map(async (rab) => {
        res.push(
          await this.rktXRabModel.create(
            { rkt_id, name: rab.name, unit: rab.unit, price: rab.price },
            { transaction: trx },
          ),
        );
      }),
    );

    return res;
  }

  private async _uploadFile(
    upload: Record<string, any>,
    field: string,
    name: string,
    allowedExt = ["pdf"],
    allowedSize = "2 mb",
  ) {
    return await UploadFile({
      file: upload.file,
      filename: name + "." + upload.ext,
      ext: upload.ext,
      folder: "uploads/rkt/",
      field,
      allowedSize,
      allowedExt,
    });
  }
}
