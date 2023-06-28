import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AkademikService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private _token = "";
  private readonly _email = this.configService.get<string>("AKADEMIK_EMAIL");
  private readonly _pass = this.configService.get<string>("AKADEMIK_PASS");
  private readonly _akademikUrl = this.configService.get<string>("AKADEMIK_URL");

  async mahasiswaAktif() {
    if (!this._token) await this._login();

    try {
      const res = await lastValueFrom(
        this.httpService.get(this._akademikUrl + "/dashboard/mahasiswa-aktif", {
          headers: { Authorization: "Bearer " + this._token },
        }),
      );

      return res.data?.data;
    } catch (err) {
      console.log(err);
    }
  }

  async pendaftaranMahasiswa() {
    if (!this._token) await this._login();

    try {
      const res = await lastValueFrom(
        this.httpService.get(this._akademikUrl + "/dashboard/mahasiswa-wisuda", {
          headers: { Authorization: "Bearer " + this._token },
        }),
      );

      return res.data?.data;
    } catch (err) {
      console.log(err);
    }
  }

  async mahasiswaCuti() {
    if (!this._token) await this._login();

    try {
      const res = await lastValueFrom(
        this.httpService.get(this._akademikUrl + "/dashboard/mahasiswa-cuti", {
          headers: { Authorization: "Bearer " + this._token },
        }),
      );

      return res.data?.data;
    } catch (err) {
      console.log(err);
    }
  }

  async mahasiswaDo() {
    if (!this._token) await this._login();

    try {
      const res = await lastValueFrom(
        this.httpService.get(this._akademikUrl + "/dashboard/mahasiswa-do", {
          headers: { Authorization: "Bearer " + this._token },
        }),
      );

      return res.data?.data;
    } catch (err) {
      console.log(err);
    }
  }

  async mahasiswaAktifProdi(tahun: string) {
    if (!this._token) await this._login();

    try {
      const res = await lastValueFrom(
        this.httpService.get(this._akademikUrl + "/dashboard/mahasiswa-prodi/" + tahun, {
          headers: { Authorization: "Bearer " + this._token },
        }),
      );

      return res.data?.data;
    } catch (err) {
      console.log(err);
    }
  }

  async mahasiswaAktifProdiByStatus(tahun: string) {
    if (!this._token) await this._login();

    try {
      const res = await lastValueFrom(
        this.httpService.get(this._akademikUrl + "/dashboard/pendaftaran-prodi-status/" + tahun, {
          headers: { Authorization: "Bearer " + this._token },
        }),
      );

      return res.data?.data;
    } catch (err) {
      console.log(err);
    }
  }

  private async _reLogin(funcName: any) {
    await this._login();
    return funcName();
  }

  private async _login() {
    try {
      const res = await lastValueFrom(
        this.httpService.post(this._akademikUrl + "/auth/login", {
          email: this._email,
          password: this._pass,
        }),
      );

      this._token = res.data?.data?.access_token;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
