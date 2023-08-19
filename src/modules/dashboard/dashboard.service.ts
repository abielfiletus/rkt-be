import { Inject, Injectable } from "@nestjs/common";
import { PenyusunanRkt } from "../penyusunan-rkt/entities/penyusunan-rkt.entity";
import { AkademikService } from "../third-party/akademik.service";

@Injectable()
export class DashboardService {
  constructor(
    @Inject(PenyusunanRkt.name) private readonly rktModel: typeof PenyusunanRkt,
    private readonly akademikService: AkademikService,
  ) {}

  async totalRkt() {
    const yearFilter = new Date().getFullYear() - 5;

    const data = await this.rktModel.sequelize.query(`
      select count(id), tahun, status from "PenyusunanRkt"
      where tahun::integer > ${yearFilter}
      group by tahun, status
      order by tahun
    `);

    const legends = [];
    const chartData = {};
    for (let i = yearFilter + 1; i <= new Date().getFullYear(); i++) {
      chartData[i] = 0;
      legends.push(i);
    }

    const map = {
      Ditolak: { name: "Ditolak", data: JSON.parse(JSON.stringify(chartData)) },
      "Dalam Proses": { name: "Dalam Proses", data: JSON.parse(JSON.stringify(chartData)) },
      Disetujui: { name: "Disetujui", data: JSON.parse(JSON.stringify(chartData)) },
    };
    data[0]?.map((item: Record<string, any>) => {
      switch (item.status) {
        case "0":
        case "2":
          map["Dalam Proses"].data[item.tahun] += Number(item.count);
          break;
        case "1":
          map.Ditolak.data[item.tahun] = +item.count;
          break;
        case "3":
          map.Disetujui.data[item.tahun] = +item.count;
          break;
      }
    });

    const res = Object.values(map);

    res.forEach((item) => {
      item.data = Object.values(item.data);
    });

    return { data: res, legends };
  }

  async rktByStatus(tahun: string) {
    const data = await this.rktModel.sequelize.query(`
        select count(prkt.id), prkt.tahun, prkt.status, p.initial
        from "PenyusunanRkt" prkt
                 join "User" u on prkt.submit_by = u.id
                 join "Prodi" p on u.kode_prodi = p.kode_prodi
        where prkt.tahun::integer = ${tahun}
        group by prkt.tahun, prkt.status, p.initial
        order by prkt.tahun
    `);

    const chartData = {};
    const legends = [];
    data[0]?.map((item: Record<string, any>) => {
      chartData[item.initial] = 0;
      legends.push(item.initial);
    });

    const map = {
      Ditolak: { name: "Ditolak", data: JSON.parse(JSON.stringify(chartData)) },
      Revisi: { name: "Revisi", data: JSON.parse(JSON.stringify(chartData)) },
      "Menunggu Verifikasi": {
        name: "Menunggu Verifikasi",
        data: JSON.parse(JSON.stringify(chartData)),
      },
      Disetujui: { name: "Disetujui", data: JSON.parse(JSON.stringify(chartData)) },
    };
    data[0]?.map((item: Record<string, any>) => {
      switch (item.status) {
        case "0":
          map["Menunggu Verifikasi"].data[item.initial] = +item.count;
          break;
        case "2":
          map.Revisi.data[item.initial] = +item.count;
          break;
        case "1":
          map.Ditolak.data[item.initial] = +item.count;
          break;
        case "3":
          map.Disetujui.data[item.initial] = +item.count;
          break;
      }
    });

    const res = Object.values(map);

    res.forEach((item) => {
      item.data = Object.values(item.data);
    });

    return { data: res, legends: [...new Set(legends)] };
  }

  async rktByCapaian(tahun: string) {
    const data = await this.rktModel.sequelize.query(`
        select count(prkt.id), prkt.tahun, c.status, p.initial
        from "Capaian" c
             join "PenyusunanRkt" prkt on c.rkt_id = prkt.id
             join "User" u on prkt.submit_by = u.id
             join "Prodi" p on u.kode_prodi = p.kode_prodi
        where prkt.tahun::integer = ${tahun}
        group by prkt.tahun, c.status, p.initial
        order by prkt.tahun
    `);

    const chartData = {};
    const legends = [];
    data[0]?.map((item: Record<string, any>) => {
      chartData[item.initial] = 0;
      legends.push(item.initial);
    });

    const map = {
      Ditolak: { name: "Ditolak", data: JSON.parse(JSON.stringify(chartData)) },
      Revisi: { name: "Revisi", data: JSON.parse(JSON.stringify(chartData)) },
      "Menunggu Verifikasi": {
        name: "Menunggu Verifikasi",
        data: JSON.parse(JSON.stringify(chartData)),
      },
      Disetujui: { name: "Disetujui", data: JSON.parse(JSON.stringify(chartData)) },
    };
    data[0]?.map((item: Record<string, any>) => {
      switch (item.status) {
        case "0":
          map["Menunggu Verifikasi"].data[item.initial] = +item.count;
          break;
        case "2":
          map.Revisi.data[item.initial] = +item.count;
          break;
        case "1":
          map.Ditolak.data[item.initial] = +item.count;
          break;
        case "3":
          map.Disetujui.data[item.initial] = +item.count;
          break;
      }
    });

    const res = Object.values(map);

    res.forEach((item) => {
      item.data = Object.values(item.data);
    });

    return { data: res, legends: [...new Set(legends)] };
  }

  async mahasiswaAktif() {
    const data = await this.akademikService.mahasiswaAktif();

    const legends = [];
    const counts = [];
    data?.map((item) => {
      counts.push(item.count);
      legends.push(item.tahun);
    });

    return { data: { name: "Mahasiswa", data: counts }, legends };
  }

  async pendaftaranWisuda() {
    const data = await this.akademikService.pendaftaranMahasiswa();

    const legends = [];
    const counts = [];
    data?.map((item) => {
      counts.push(item.count);
      legends.push(item.tahun);
    });

    return { data: { name: "Mahasiswa", data: counts }, legends };
  }

  async mahasiswaCuti() {
    const data = await this.akademikService.mahasiswaCuti();

    const legends = [];
    const counts = [];
    data?.map((item) => {
      counts.push(item.count);
      legends.push(item.tahun);
    });

    return { data: { name: "Mahasiswa", data: counts }, legends };
  }

  async mahasiswaDo() {
    const data = await this.akademikService.mahasiswaDo();

    const legends = [];
    const counts = [];
    data?.map((item) => {
      counts.push(item.count);
      legends.push(item.tahun);
    });

    return { data: { name: "Mahasiswa", data: counts }, legends };
  }

  async mahasiswaAktifProdi(tahun: string) {
    const data = await this.akademikService.mahasiswaAktifProdi(tahun);

    const map = {
      aktif: { name: "Aktif", data: [] },
      "non aktif": { name: "Non Aktif", data: [] },
      cuti: { name: "Cuti", data: [] },
      do: { name: "DO", data: [] },
    };

    const legends = [];
    data?.map((item: Record<string, any>) => {
      map[item.status].data.push(item.count);
      legends.push(item.prodi);
    });

    return { data: Object.values(map), legends: [...new Set(legends)] };
  }

  async mahasiswaAktifProdiByStatus(tahun: string) {
    const data = await this.akademikService.mahasiswaAktifProdiByStatus(tahun);

    const map = {
      4: { name: "Tidak Lulus", data: [] },
      6: { name: "Lulus", data: [] },
    };

    const legends = [];
    data?.map((item: Record<string, any>) => {
      map[item.status].data.push(item.count);
      legends.push(item.prodi);
    });

    return { data: Object.values(map), legends: [...new Set(legends)] };
  }
}
