import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePerjanjianKerjaDto } from "./dto/create-perjanjian-kerja.dto";
import { UpdatePerjanjianKerjaDto } from "./dto/update-perjanjian-kerja.dto";
import { PerjanjianKerja, PerjanjianKerjaScope } from "./entities/perjanjian-kerja.entity";
import { GetAllPerjanjianKerjaDto } from "./dto/get-all-perjanjian-kerja.dto";
import { currencyFormatter, prepareQuery, RollbackFile, UploadFile } from "../../util";
import { Op } from "sequelize";
import { HttpMessage, ValidationMessage, VerificationStatus } from "../../common";
import { VerifyPerjanjianKerjaDto } from "./dto/verify-perjanjian-kerja.dto";
import {
  PenyusunanRkt,
  PenyusunanRktScope,
} from "../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { page1Template } from "./template/page-1";
import * as moment from "moment";
import * as fs from "fs";
import * as puppeteer from "puppeteer";
import { generate } from "../../util/qrcode.util";
import { page2Template } from "./template/page-2";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFMerger = require("pdf-merger-js");

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

  async download(id: number) {
    const merger = new PDFMerger();
    let data: any = await this.pkModel.sequelize.query(`
        select
            prkt.id,
            prkt.no_pengajuan as no_rkt, 
            u1.name as submit_name, 
            r1.name as submit_title, 
            u2.name as approver_name,
            r2.name as approver_title
        from "PenyusunanRkt" prkt 
            join "User" u1 on u1.id = prkt.submit_by
            join "Role" r1 on r1.id = u1.role_id
            join "User" u2 on u2.id = prkt.verified_by
            join "Role" r2 on r2.id = u2.role_id
        where prkt.id = ${id}
    `);

    data = data?.[0]?.[0];

    if (!data) {
      throw new HttpException("Data tidak ditemukan", HttpStatus.BAD_REQUEST);
    }

    // eslint-disable-next-line prefer-const
    let [qrContent, rkt]: any = await Promise.all([
      this.pkModel.sequelize.query(`
        select 
            prkt.id,
            prkt.no_pengajuan, 
            u.name as submiter_name,
            prkt.name,
            prkt.usulan_anggaran,
            prkt."updatedAt"
        from "PenyusunanRkt" prkt 
            join "User" u on u.id = prkt.submit_by
        where prkt.id = ${id}
      `),
      this.rktModel.findByPk(id, { include: PenyusunanRktScope.iku }),
    ]);

    qrContent = qrContent?.[0]?.[0];

    const logo = fs.readFileSync("logo-polnam.png", { encoding: "base64" });

    const html1 = page1Template({
      date: moment().locale("id").format("D MMMM YYYY"),
      logo: "data:image/png;base64," + logo,
      ...data,
    });
    const html2 = page2Template({
      logo: "data:image/png;base64," + logo,
      no_rkt: data.no_rkt,
      usulan_anggaran: currencyFormatter.format(qrContent.usulan_anggaran),
      tahun: rkt.tahun,
      rkt_data: rkt,
    });

    // console.log(html2);

    const qr = await generate({
      content: JSON.stringify({
        id: qrContent.id,
        "No Pengajuan": qrContent.no_pengajuan,
        "Nama Pengusul": qrContent.submiter_name,
        "Nama Kegiatan": qrContent.name,
        "Usulan Anggaran": currencyFormatter.format(qrContent.usulan_anggaran),
        "Tanggal Persetujuan Direktur": moment(qrContent.updatedAt)
          .locale("id")
          .format("D MMMM YYYY HH:mm"),
      }),
      size: 150,
    });

    const baseFilename = "draft-pk-" + data.id;
    const filename1 = baseFilename + "-1.pdf";
    const filename2 = baseFilename + "-2.pdf";

    const browser = await puppeteer.launch({ headless: "new" });
    const tab = await browser.newPage();
    await tab.setContent(html1, { waitUntil: "load" });
    await tab.pdf({
      path: filename1,
      format: "a4",
      printBackground: true,
      displayHeaderFooter: true,
      footerTemplate: `<div style="text-align: right; width: 100%; padding-right: 20px"><img src="${qr}" alt="" style="width: 50px; height: 50px"></div>`,
      headerTemplate: "",
    });

    await tab.setContent(html2);
    await tab.pdf({
      path: filename2,
      format: "a4",
      printBackground: true,
      landscape: true,
      margin: { top: "50px", bottom: "50px" },
      displayHeaderFooter: true,
      footerTemplate: `<div style="text-align: right; width: 100%; padding-right: 20px"><img src="${qr}" alt="" style="width: 40px; height: 40px"></div>`,
      headerTemplate: "<span></span>",
    });

    await browser.close();

    await merger.add(filename1);
    await merger.add(filename2);
    const pdf = await merger.saveAsBuffer();

    if (fs.existsSync("./" + filename1)) fs.rmSync("./" + filename1);
    if (fs.existsSync("./" + filename2)) fs.rmSync("./" + filename2);

    return { file: Buffer.from(pdf).toString("base64"), no_pengajuan: qrContent.no_pengajuan };
  }

  async update(id: number, body: UpdatePerjanjianKerjaDto) {
    let file: any = "";
    try {
      const check = await this.pkModel.findByPk(id, { raw: true });

      if (!check) {
        throw new HttpException(ValidationMessage.notFound, HttpStatus.NOT_FOUND);
      }

      if (
        ![
          VerificationStatus.no_action,
          VerificationStatus.revision,
          VerificationStatus.rejected,
        ].includes(check.status)
      ) {
        throw new HttpException(HttpMessage.cantUpdateCausedSubmitted, HttpStatus.BAD_REQUEST);
      }

      if (body.perjanjian_kerja) {
        file = await this._uploadFile(body.perjanjian_kerja, "perjanjian_kerja", check.rkt_id + "");
        body.perjanjian_kerja = file;
      }

      return this.pkModel.update(
        { perjanjian_kerja: body.perjanjian_kerja, status: VerificationStatus.on_verification },
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

    if (check.status !== VerificationStatus.on_verification) {
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
