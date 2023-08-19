import { Inject, Injectable } from "@nestjs/common";
import { CreateCapaianDto } from "./dto/create-capaian.dto";
import { Capaian } from "./entities/capaian.entity";
import { CapaianXIku } from "./entities/capaian-x-iku";
import { currencyFormatter, prepareQuery } from "../../util";
import { Op } from "sequelize";
import { GetAllCapaianDto } from "./dto/get-all-capaian.dto";
import { PenyusunanRkt } from "../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { CapaianStatus, CapaianStatusExcel, Timezone } from "../../common";
import { UpdateCapaianDto } from "./dto/update-capaian.dto";
import { IndikatorKinerjaUtama } from "../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";
import { RktXIku } from "../penyusunan-rkt/entities/rkt-x-iku.entity";
import { IkuXAksi } from "../penyusunan-rkt/entities/iku-x-aksi.entity";
import { PerjanjianKerja } from "../perjanjian-kerja/entities/perjanjian-kerja.entity";
import * as moment from "moment-timezone";
import { excel } from "../../util/excel";

@Injectable()
export class CapaianService {
  constructor(
    @Inject(Capaian.name)
    private readonly capaianModel: typeof Capaian,
    @Inject(CapaianXIku.name)
    private readonly capaianXIkuModel: typeof CapaianXIku,
    @Inject(PenyusunanRkt.name)
    private readonly rktModel: typeof PenyusunanRkt,
    @Inject(PerjanjianKerja.name)
    private readonly pkModel: typeof PerjanjianKerja,
  ) {}

  async create(body: CreateCapaianDto) {
    if (!body.iku_data.length) throw "Iku data is required";

    const capaian = await this.capaianModel.create(
      {
        rkt_id: body.rkt_id,
        status: CapaianStatus.un_processed,
      },
      { transaction: body.trx },
    );

    await this.capaianXIkuModel.bulkCreate(
      body.iku_data.map((item) => {
        return { iku_id: item, capaian_id: capaian.id };
      }),
      { transaction: body.trx },
    );

    return capaian;
  }

  async findAll(params: GetAllCapaianDto) {
    // eslint-disable-next-line prefer-const
    let { where, include, order, offset, limit } = prepareQuery(params, {});

    if (!include) {
      include = { model: PenyusunanRkt };
    }

    if (params.status) where.status = params.status;
    if (params.name) {
      include.where ||= {};
      include.where["name"] = { [Op.iLike]: `%${params.name}%` };
    }
    if (params.usulan_anggaran) {
      include.where ||= {};
      include.where["usulan_anggaran"] = params.usulan_anggaran;
    }
    if (params.tahun) {
      include.where ||= {};
      include.where["tahun"] = params.tahun;
    }

    const [data, recordsFiltered, recordsTotal] = await Promise.all([
      this.capaianModel.findAll({ where, limit, offset, order, include }),
      this.capaianModel.count({ where, include }),
      this.capaianModel.count(),
    ]);

    return { data, recordsTotal, recordsFiltered };
  }

  findOne(id: number) {
    return this.capaianModel.findByPk(id, {
      include: [
        {
          model: PenyusunanRkt,
          include: [{ model: RktXIku, include: [{ model: IndikatorKinerjaUtama }] }],
        },
        { model: CapaianXIku, include: [{ model: IndikatorKinerjaUtama }] },
      ],
    });
  }

  async detailByRkt(id: number) {
    const rkt = await this.rktModel.findByPk(id, {
      include: { model: RktXIku, include: [{ model: IndikatorKinerjaUtama }, { model: IkuXAksi }] },
    });

    const iku_id = rkt.rkt_x_iku.map((item) => item.iku_id);

    const capaian = await this.capaianXIkuModel.findAll({ where: { iku_id } });

    const hashCapaian = {};
    capaian.map((item) => (hashCapaian[item.iku_id] = item));

    rkt.rkt_x_iku.forEach((iku) => {
      const ikuCapaian = hashCapaian[iku.iku_id];

      iku.setDataValue("capaian", ikuCapaian);
    });

    return rkt;
  }

  async update(id: number, body: UpdateCapaianDto) {
    const trx = await this.capaianXIkuModel.sequelize.transaction();
    try {
      await Promise.all(
        body.data.map(async (item) => {
          const mock = {
            [`capaian_${body.tw_index}`]: item.capaian,
            [`masalah_${body.tw_index}`]: item.masalah,
            [`progress_${body.tw_index}`]: item.progress,
            [`strategi_${body.tw_index}`]: item.strategi,
          };

          if (body.tw_index === 4) {
            mock.status = CapaianStatus.complete;
          } else {
            mock.status = CapaianStatus.processed;
          }

          const res = await this.capaianXIkuModel.update(mock, {
            where: { id: item.id_capaian_iku },
            transaction: trx,
            returning: true,
          });

          if (res[1]?.[0]?.capaian_id) {
            await this.capaianModel.update(
              { status: body.tw_index === 4 ? CapaianStatus.complete : CapaianStatus.processed },
              { where: { id: res[1][0].capaian_id } },
            );
            if (body.tw_index === 4) id = res[1][0].capaian_id;
          }
        }),
      );

      await trx.commit();

      return "Successfully submit data";
    } catch (err) {
      console.log(err);
      await trx.rollback();

      throw err;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} capaian`;
  }

  async download(params: GetAllCapaianDto) {
    const where: Record<string, any> = {};
    const include: Array<Record<string, any>> = [
      { model: PenyusunanRkt, required: true },
      { model: CapaianXIku, include: [{ model: IndikatorKinerjaUtama, required: true }] },
    ];

    if (params.status) where.status = params.status;
    if (params.name) {
      include[0].where ||= {};
      include[0].where["name"] = { [Op.iLike]: `%${params.name}%` };
    }
    if (params.usulan_anggaran) {
      include[0].where ||= {};
      include[0].where["usulan_anggaran"] = params.usulan_anggaran;
    }
    if (params.tahun) {
      include[0].where ||= {};
      include[0].where["tahun"] = params.tahun;
    }

    const rawData = await this.capaianModel.findAll({ where, include });

    const data = [];
    let highestIkuCount = 0;

    rawData.map((item, i) => {
      if (item.capaian_x_iku.length > highestIkuCount) highestIkuCount = item.capaian_x_iku.length;

      const rowData = {
        no: i + 1,
        name: item.rkt.name,
        budget: currencyFormatter.format(item.rkt.usulan_anggaran),
        year: item.rkt.tahun,
        last_status: CapaianStatusExcel[item.status],
        last_updated: moment(item.updatedAt).tz(Timezone).format("DD MMMM YYYY HH:mm"),
      };

      for (const [j, capaian] of item.capaian_x_iku.entries()) {
        const ikuIndex = j + 1;
        rowData["achievement_1_iku_" + ikuIndex] = capaian.capaian_1;
        rowData["problem_1_iku_" + ikuIndex] = capaian.masalah_1;
        rowData["strategy_1_iku_" + ikuIndex] = capaian.strategi_1;
        rowData["progress_1_iku_" + ikuIndex] = capaian.progress_1;
        rowData["achievement_2_iku_" + ikuIndex] = capaian.capaian_2;
        rowData["problem_2_iku_" + ikuIndex] = capaian.masalah_2;
        rowData["strategy_2_iku_" + ikuIndex] = capaian.strategi_2;
        rowData["progress_2_iku_" + ikuIndex] = capaian.progress_2;
        rowData["achievement_3_iku_" + ikuIndex] = capaian.capaian_3;
        rowData["problem_3_iku_" + ikuIndex] = capaian.masalah_3;
        rowData["strategy_3_iku_" + ikuIndex] = capaian.strategi_3;
        rowData["progress_3_iku_" + ikuIndex] = capaian.progress_3;
        rowData["achievement_4_iku_" + ikuIndex] = capaian.capaian_4;
        rowData["problem_4_iku_" + ikuIndex] = capaian.masalah_4;
        rowData["strategy_4_iku_" + ikuIndex] = capaian.strategi_4;
        rowData["progress_4_iku_" + ikuIndex] = capaian.progress_4;
      }

      data.push(rowData);
    });

    const header = {
      No: "no",
      "Nama RKT": "name",
      "Usulan Anggaran": "budget",
      "Tahun Usulan": "year",
    };
    const field = {
      no: "no",
      name: "name",
      budget: "budget",
      year: "year",
    };

    for (let i = 1; i <= highestIkuCount; i++) {
      header["Capaian 1 IKU " + i] = "achievement_1_iku_" + i;
      header["Masalah 1 IKU " + i] = "problem_1_iku_" + i;
      header["Strategi 1 IKU " + i] = "strategy_1_iku_" + i;
      header["Progres 1 IKU " + i] = "progress_1_iku_" + i;
      header["Capaian 2 IKU " + i] = "achievement_2_iku_" + i;
      header["Masalah 2 IKU " + i] = "problem_2_iku_" + i;
      header["Strategi 2 IKU " + i] = "strategy_2_iku_" + i;
      header["Progres 2 IKU " + i] = "progress_2_iku_" + i;
      header["Capaian 3 IKU " + i] = "achievement_3_iku_" + i;
      header["Masalah 3 IKU " + i] = "problem_3_iku_" + i;
      header["Strategi 3 IKU " + i] = "strategy_3_iku_" + i;
      header["Progres 3 IKU " + i] = "progress_3_iku_" + i;
      header["Capaian 4 IKU " + i] = "achievement_4_iku_" + i;
      header["Masalah 4 IKU " + i] = "problem_4_iku_" + i;
      header["Strategi 4 IKU " + i] = "strategy_4_iku_" + i;
      header["Progres 4 IKU " + i] = "progress_4_iku_" + i;

      field["achievement_1_iku_" + i] = "achievement_1_iku_" + i;
      field["problem_1_iku_" + i] = "problem_1_iku_" + i;
      field["strategy_1_iku_" + i] = "strategy_1_iku_" + i;
      field["progress_1_iku_" + i] = "progress_1_iku_" + i;
      field["achievement_2_iku_" + i] = "achievement_2_iku_" + i;
      field["problem_2_iku_" + i] = "problem_2_iku_" + i;
      field["strategy_2_iku_" + i] = "strategy_2_iku_" + i;
      field["progress_2_iku_" + i] = "progress_2_iku_" + i;
      field["achievement_3_iku_" + i] = "achievement_3_iku_" + i;
      field["problem_3_iku_" + i] = "problem_3_iku_" + i;
      field["strategy_3_iku_" + i] = "strategy_3_iku_" + i;
      field["progress_3_iku_" + i] = "progress_3_iku_" + i;
      field["achievement_4_iku_" + i] = "achievement_4_iku_" + i;
      field["problem_4_iku_" + i] = "problem_4_iku_" + i;
      field["strategy_4_iku_" + i] = "strategy_4_iku_" + i;
      field["progress_4_iku_" + i] = "progress_4_iku_" + i;
    }

    header["Terakhir Diupdate"] = "last_updated";
    header["Status Terakhir"] = "last_status";

    field["last_updated"] = "last_updated";
    field["last_status"] = "last_status";

    return await excel
      .init({
        filename: `Data Capaian ${Date.now()}`,
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
}
