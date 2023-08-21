import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePenyusunanRktDto } from "./dto/create-penyusunan-rkt.dto";
import { VerifyPenyusunanRktDto } from "./dto/verify-penyusunan-rkt.dto";
import { PenyusunanRkt, PenyusunanRktScope } from "./entities/penyusunan-rkt.entity";
import { RktXRab } from "./entities/rkt-x-rab.entity";
import { RktXIku } from "./entities/rkt-x-iku.entity";
import { IkuXAksi } from "./entities/iku-x-aksi.entity";
import { Op, Transaction } from "sequelize";
import { currencyFormatter, prepareQuery, RollbackFile, romanize, UploadFile } from "../../util";
import {
  HttpMessage,
  RejectionHistoryDelete,
  RejectionRoleTarget,
  Timezone,
  ValidationMessage,
  VerificationRoleStep,
  VerificationStatus,
  VerificationStatusExcel,
} from "../../common";
import { IndikatorKinerjaUtama } from "../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";
import { GetAllPenyusunanRktDto } from "./dto/get-all-penyusunan-rkt.dto";
import { PerjanjianKerja } from "../perjanjian-kerja/entities/perjanjian-kerja.entity";
import { RktNoteHistory } from "../rkt-note-history/entities/rkt-note-history.entity";
import { excel } from "../../util/excel";
import * as moment from "moment-timezone";

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
    if (params.user_role === 2) where.submit_by = params.user_id;

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.rktModel.findAll({ where, limit, offset, order, include }),
      this.rktModel.count({ distinct: true, where, include }),
      this.rktModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.rktModel.findByPk(id, {
      include: PenyusunanRktScope.all,
      order: [[{ model: RktXIku, as: "rkt_x_iku" }, "order", "asc"]],
    });
  }

  async filter(user_id: number, role: number) {
    let where = "";

    if (role !== 1) {
      where = `WHERE (submit_by = ${user_id} OR verification_role_target = ${role})`;
    }

    const [tahunData, submitUserData] = await Promise.all([
      this.rktModel.findAll({
        group: "tahun",
        attributes: ["tahun"],
        where:
          role !== 1
            ? {
                [Op.or]: [{ submit_by: user_id }, { verification_role_target: role }],
              }
            : {},
      }),
      this.rktModel.sequelize.query(
        `SELECT u.name FROM "PenyusunanRkt" pr JOIN "User" u on pr.submit_by = u.id ${where} GROUP BY u.name`,
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

      const history = check.history || { user: [], approvedAt: [] };
      mock.status = VerificationStatus.on_verification;
      mock.verification_role_target = VerificationRoleStep[Math.max(history.user.length, 0)];

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
      const check = await this.rktModel.findByPk(id, {
        include: { model: RktXIku, as: "rkt_x_iku" },
      });
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
        verification_role_target = VerificationRoleStep[Math.max(history.user.length, 0) + 1];

        if (verification_role_target) {
          body.status = VerificationStatus.on_verification;

          history.user.push(body.verified_name);
          history.approvedAt.push(new Date().toISOString());
        } else {
          verification_role_target = null;
          body.status = VerificationStatus.done;
        }
      }

      if (body.status === VerificationStatus.revision) {
        const targetIndex = Math.max(history.user.length, 0);
        verification_role_target = RejectionRoleTarget[targetIndex];
        if (history.user?.length && targetIndex) {
          const targetToRemove = RejectionHistoryDelete[targetIndex];
          history.user = history.user.slice(0, targetToRemove);
          history.approvedAt = history.approvedAt.slice(0, targetToRemove);
        }
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
          status:
            body.status === VerificationStatus.done ? VerificationStatus.approved : body.status,
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

  async download(params: GetAllPenyusunanRktDto) {
    let where: Record<string, any> = {};

    if (params.tahun) where.tahun = params.tahun;
    if (params.name) where.name = { [Op.iLike]: `%${params.name}%` };
    if (params.submit_name) where["$user_submit.name$"] = params.submit_name;
    if (params.submit_id) where.submit_by = params.submit_id;
    if (params.submit_prodi) where["$user_submit.kode_prodi$"] = params.submit_prodi;
    if (params.status) where.status = params.status;

    if (params.user_role !== 1) {
      where = {
        ...where,
        [Op.or]: [{ submit_by: params.user_id }, { verification_role_target: params.user_role }],
      };
    }
    if ([3, 4, 5].includes(params.user_role)) {
      where.status = { [Op.ne]: VerificationStatus.rejected };
    }

    const rawData = await this.rktModel.findAll({
      where,
      include: PenyusunanRktScope.all,
      order: [[{ model: RktXIku, as: "rkt_x_iku" }, "order", "asc"]],
    });

    const data = [];
    let highestIkuCount = 0;
    let highestAksiCount = 0;

    rawData.map((item, i) => {
      if (item.rkt_x_iku.length > highestIkuCount) highestIkuCount = item.rkt_x_iku.length;

      const add = !["3", "4", "5"].includes(item.status) ? item.verification_role.name : "";
      const rowData = {
        no: i + 1,
        title: item.name,
        year: item.tahun,
        budget: currencyFormatter.format(item.usulan_anggaran),
        target: item.target_perjanjian_kerja + "%",
        created_by: item.user_submit.name,
        created_at: moment(item.createdAt).tz(Timezone).format("DD MMMM YYYY HH:mm"),
        last_status: VerificationStatusExcel[item.status] + add,
        last_updated: moment(item.updatedAt).tz(Timezone).format("DD MMMM YYYY HH:mm"),
        last_note: [VerificationStatus.rejected, VerificationStatus.revision].includes(item.status)
          ? item.notes
          : "",
      };

      for (const [i, rkt] of item.rkt_x_iku.entries()) {
        if (rkt.iku_x_aksi.length > highestAksiCount) highestAksiCount = rkt.iku_x_aksi.length;

        const index = i + 1;
        rowData["iku_" + index] = rkt.iku.name;
        rowData["iku_tw_1_" + index] = rkt.tw_1;
        rowData["iku_tw_2_" + index] = rkt.tw_2;
        rowData["iku_tw_3_" + index] = rkt.tw_3;
        rowData["iku_tw_4_" + index] = rkt.tw_4;
        rowData["iku_total_" + index] = rkt.total;

        for (const [j, aksi] of rkt.iku_x_aksi.entries()) {
          const aksiIndex = j + 1;
          rowData["iku_" + index + "_aksi_" + aksiIndex] = aksi.rencana_aksi;
        }
      }

      data.push(rowData);
    });

    const header = {
      No: "no",
      "Nama Usulan Kegiatan": "title",
      "Tahun Usulan": "year",
      "Usulan Anggaran": "budget",
      "Target Perjanjian Kerja": "target",
    };
    const field = {
      no: "no",
      title: "title",
      year: "year",
      budget: "budget",
      target: "target",
    };

    for (let i = 1; i <= highestIkuCount; i++) {
      header["IKU " + i] = "iku_" + i;
      header["TW 1 IKU " + i] = "iku_tw_1_" + i;
      header["TW 2 IKU " + i] = "iku_tw_2_" + i;
      header["TW 3 IKU " + i] = "iku_tw_3_" + i;
      header["TW 4 IKU " + i] = "iku_tw_4_" + i;
      header["TOTAL IKU " + i] = "iku_total_" + i;

      field["iku_" + i] = "iku_" + i;
      field["iku_tw_1_" + i] = "iku_tw_1_" + i;
      field["iku_tw_2_" + i] = "iku_tw_2_" + i;
      field["iku_tw_3_" + i] = "iku_tw_3_" + i;
      field["iku_tw_4_" + i] = "iku_tw_4_" + i;
      field["iku_total_" + i] = "iku_total_" + i;

      for (let j = 1; j <= highestAksiCount; j++) {
        header["Rencana Aksi " + j + " IKU " + i] = "iku_" + i + "_aksi_" + j;
        field["iku_" + i + "_aksi_" + j] = "iku_" + i + "_aksi_" + j;
      }
    }

    header["Diajukan Pada"] = "created_at";
    header["Terakhir Diupdate"] = "last_updated";
    header["Status Terakhir"] = "last_status";
    header["Keterangan Revisi / Ditolak"] = "last_note";
    header["Dibuat Oleh"] = "created_by";

    field["created_at"] = "created_at";
    field["last_updated"] = "last_updated";
    field["last_status"] = "last_status";
    field["last_note"] = "last_note";
    field["created_by"] = "created_by";

    return await excel
      .init({
        filename: `Report Penyusunan RKT ${Date.now()}`,
        headerTitle: header,
        rowsData: data,
        rowsField: field,
        showGridLines: false,
      })
      .addWorkSheet({ name: "Data" })
      .addHeader()
      .addRows()
      .autoSizeColumn()
      .addBgColor()
      .addBorder()
      .generate();
  }

  async outstandingSummary(role_id: number) {
    return await this.rktModel.count({
      where: { status: VerificationStatus.on_verification, verification_role_target: role_id },
    });
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
            order: i,
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
