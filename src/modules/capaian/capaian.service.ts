import { Inject, Injectable } from "@nestjs/common";
import { CreateCapaianDto } from "./dto/create-capaian.dto";
import { Capaian } from "./entities/capaian.entity";
import { CapaianXIku } from "./entities/capaian-x-iku";
import { prepareQuery } from "../../util";
import { Op } from "sequelize";
import { GetAllCapaianDto } from "./dto/get-all-capaian.dto";
import { PenyusunanRkt } from "../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { CapaianStatus } from "../../common";
import { UpdateCapaianDto } from "./dto/update-capaian.dto";
import { IndikatorKinerjaUtama } from "../indikator-kinerja-utama/entities/indikator-kinerja-utama.entity";
import { RktXIku } from "../penyusunan-rkt/entities/rkt-x-iku.entity";
import { IkuXAksi } from "../penyusunan-rkt/entities/iku-x-aksi.entity";

@Injectable()
export class CapaianService {
  constructor(
    @Inject(Capaian.name)
    private readonly capaianModel: typeof Capaian,
    @Inject(CapaianXIku.name)
    private readonly capaianXIkuModel: typeof CapaianXIku,
    @Inject(PenyusunanRkt.name)
    private readonly rktModel: typeof PenyusunanRkt,
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

    if (!include) include = [{ model: PenyusunanRkt }, { model: CapaianXIku }];

    if (params.name) where["$rkt.name$"] = { [Op.iLike]: `%${params.name}%` };
    if (params.status) where.status = params.status;
    if (params.usulan_anggaran) where["$rkt.usulan_anggaran$"] = params.usulan_anggaran;
    if (params.tahun) where["$rkt.tahun$"] = params.tahun;

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

          await this.capaianXIkuModel.update(mock, {
            where: { id: item.id_capaian_iku },
            transaction: trx,
            returning: true,
          });
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
}
