import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePenyusunanRktDto } from "./dto/create-penyusunan-rkt.dto";
import { VerifyPenyusunanRktDto } from "./dto/verify-penyusunan-rkt.dto";
import { PenyusunanRkt, PenyusunanRktScope } from "./entities/penyusunan-rkt.entity";
import { RktXRab } from "./entities/rkt-x-rab.entity";
import { RktXIku } from "./entities/rkt-x-iku.entity";
import { IkuXAksi } from "./entities/iku-x-aksi.entity";
import { Op, Transaction } from "sequelize";
import { prepareQuery, RollbackFile, UploadFile } from "../../util";
import { HttpMessage, ValidationMessage, VerificationStatus } from "../../common";
import { IndikatorKinerjaUtama } from "../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";
import { GetAllPenyusunanRktDto } from "./dto/get-all-penyusunan-rkt.dto";
import { PerjanjianKerja } from "../perjanjian-kerja/entities/perjanjian-kerja.entity";

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
  ) {}

  async create(body: CreatePenyusunanRktDto) {
    const trx = await this.rktModel.sequelize.transaction();
    const file = [];
    try {
      const rkt = await this.rktModel.create(
        {
          tahun: body.tahun,
          rencana_strategi_id: body.rencana_strategi_id,
          name: body.name,
          satuan_kerja: body.satuan_kerja,
          target_perjanjian_kerja: body.target_perjanjian_kerja,
          usulan_anggaran: body.usulan_anggaran,
          submit_by: body.submit_by,
        },
        { transaction: trx },
      );

      const [kak, referensi_harga, pendukung] = await Promise.all([
        this._uploadFile(body.kak, "kak", "kak-" + rkt.id),
        this._uploadFile(body.referensi_harga, "referensi_harga", "referensi_harga-" + rkt.id),
        this._uploadFile(
          body.pendukung,
          "pendukung",
          "pendukung-" + rkt.id,
          ["jpg", "jpeg", "png", "pdf"],
          "2 mb",
        ),
      ]);

      file.push(kak);
      file.push(referensi_harga);
      file.push(pendukung);

      const [rkt_x_iku, rkt_x_rab, newRkt] = await Promise.all([
        this._createRktXIku(body.iku_data, rkt.id, trx),
        this._createRktXRab(body.rab_data, rkt.id, trx),
        this.rktModel.update(
          { kak, referensi_harga, pendukung },
          { where: { id: rkt.id }, transaction: trx, returning: true },
        ),
        this.pkModel.create(
          { rkt_id: rkt.id, submit_by: body.submit_by, status: VerificationStatus.no_action },
          { transaction: trx },
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

      if (![VerificationStatus.pending, VerificationStatus.revision].includes(check.status)) {
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
          ["jpg", "jpeg", "png", "pdf"],
          "2 mb",
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
    try {
      const check = await this.rktModel.findByPk(id, { raw: true });

      if (!check) {
        throw new HttpException(HttpMessage.notFound, HttpStatus.NOT_FOUND);
      }

      if (check.status !== VerificationStatus.pending) {
        throw new HttpException(HttpMessage.dontNeedVerification, HttpStatus.BAD_REQUEST);
      }

      const res = await this.rktModel.update(
        {
          status: VerificationStatus[body.status],
          verified_by: body.verified_by,
          notes: body.notes,
        },
        { where: { id }, returning: true },
      );

      return res[1][0];
    } catch (err) {
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
    console.log(data);
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
          { rkt_id, iku_id: iku.iku_id },
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
    allowedSize = "300 kb",
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
