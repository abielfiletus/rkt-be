import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePerjanjianKerjaDto } from "./dto/create-perjanjian-kerja.dto";
import { UpdatePerjanjianKerjaDto } from "./dto/update-perjanjian-kerja.dto";
import { PerjanjianKerja, PerjanjianKerjaScope } from "./entities/perjanjian-kerja.entity";
import { GetAllPerjanjianKerjaDto } from "./dto/get-all-perjanjian-kerja.dto";
import { prepareQuery, RollbackFile, UploadFile } from "../../util";
import { Op } from "sequelize";
import { HttpMessage, ValidationMessage, VerificationStatus } from "../../common";
import { VerifyPerjanjianKerjaDto } from "./dto/verify-perjanjian-kerja.dto";
import { PenyusunanRkt } from "../penyusunan-rkt/entities/penyusunan-rkt.entity";

@Injectable()
export class PerjanjianKerjaService {
  constructor(
    @Inject(PerjanjianKerja.name)
    private readonly pkModel: typeof PerjanjianKerja,
    @Inject(PenyusunanRkt.name)
    private readonly rktModel: typeof PenyusunanRkt,
  ) {}

  async create(body: CreatePerjanjianKerjaDto) {
    let file: any = "";
    try {
      if (body.perjanjian_kerja) {
        file = await this._uploadFile(body.perjanjian_kerja, "perjanjian_kerja", body.rkt_id + "");
        body.perjanjian_kerja = file;
      }

      return this.pkModel.create({ rkt_id: body.rkt_id, perjanjian_kerja: file });
    } catch (err) {
      await RollbackFile(file);
      throw err;
    }
  }

  async findAll(params: GetAllPerjanjianKerjaDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, PerjanjianKerjaScope);

    if (!include) include = PerjanjianKerjaScope.all;

    if (params.rkt_name) where["$rkt.name$"] = { [Op.iLike]: `%${params.rkt_name}%` };
    if (params.rkt_tahun) where["$rkt.tahun$"] = params.rkt_tahun;
    if (params.rkt_anggaran) where["$rkt.usulan_anggaran$"] = params.rkt_anggaran;
    if (params.submit_prodi) where["$user_submit.kode_prodi$"] = params.submit_prodi;
    if (params.status) where.status = params.status;

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.pkModel.findAll({ where, limit, offset, order, include }),
      this.pkModel.count({ distinct: true, where, include }),
      this.pkModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.pkModel.findByPk(id, { include: PerjanjianKerjaScope.all });
  }

  async filter() {
    const [tahunData, anggaranData] = await Promise.all([
      this.rktModel.findAll({ group: "tahun", attributes: ["tahun"] }),
      this.rktModel.findAll({ group: "usulan_anggaran", attributes: ["usulan_anggaran"] }),
    ]);

    const tahun = {};
    const anggaran = {};

    tahunData.map((item) => (tahun[item.tahun] = true));
    anggaranData.map((item) => (anggaran[item.usulan_anggaran] = true));

    return { tahun: Object.keys(tahun), anggaran: Object.keys(anggaran) };
  }

  async update(id: number, body: UpdatePerjanjianKerjaDto) {
    let file: any = "";
    try {
      const check = await this.pkModel.findByPk(id, { raw: true });

      if (!check) {
        throw new HttpException(ValidationMessage.notFound, HttpStatus.NOT_FOUND);
      }

      if (![VerificationStatus.no_action, VerificationStatus.revision].includes(check.status)) {
        throw new HttpException(HttpMessage.cantUpdateCausedSubmitted, HttpStatus.BAD_REQUEST);
      }

      if (body.perjanjian_kerja) {
        file = await this._uploadFile(body.perjanjian_kerja, "perjanjian_kerja", check.rkt_id + "");
        body.perjanjian_kerja = file;
      }

      return this.pkModel.update(
        { perjanjian_kerja: body.perjanjian_kerja, status: VerificationStatus.pending },
        { where: { id } },
      );
    } catch (err) {
      await RollbackFile(file);
      throw err;
    }
  }

  async verify(id: number, body: VerifyPerjanjianKerjaDto) {
    const check = await this.pkModel.findByPk(id, { raw: true });

    if (!check) {
      throw new HttpException(HttpMessage.notFound, HttpStatus.NOT_FOUND);
    }

    if (check.status !== VerificationStatus.pending) {
      throw new HttpException(HttpMessage.dontNeedVerification, HttpStatus.BAD_REQUEST);
    }

    const res = await this.pkModel.update(
      {
        status: VerificationStatus[body.status],
        verified_by: body.verified_by,
        notes: body.notes,
      },
      { where: { id }, returning: true },
    );

    return res[1][0];
  }

  remove(id: number) {
    return this.pkModel.destroy({ where: { id } });
  }

  private async _uploadFile(upload: Record<string, any>, field: string, name: string) {
    return await UploadFile({
      file: upload.file,
      filename: name + "." + upload.ext,
      ext: upload.ext,
      folder: "uploads/perjanjian-kerja/",
      field,
      allowedSize: "300 kb",
      allowedExt: ["pdf"],
    });
  }
}
