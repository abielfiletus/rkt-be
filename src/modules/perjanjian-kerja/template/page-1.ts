interface IParams {
  logo?: string;
  no_rkt?: string;
  submit_name?: string;
  submit_title?: string;
  approver_name?: string;
  approver_title?: string;
  date?: string;
}

export const page1Template = (params: IParams) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" />
  <title>Draft PK ${params.no_rkt}</title>
  <style>
      body {
          font-family: "Roboto", sans-serif;
          padding: 1.5rem;
          position: relative;
      }
  </style>
</head>
<body>
  <div >
    <div style="position:relative; padding-bottom: 20px">
      <img src="${params.logo}" alt="" style="position: absolute; width: 70px; height: 70px">
      <div style="text-align: center; flex-grow: 1">
        <p style="margin-top: 0; margin-bottom: 0; font-size: 1.5rem">KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN</p>
        <p style="font-weight: bold;margin-top: 7px; margin-bottom: 7px; font-size: 1.5rem">Politeknik Negeri Ambon</p>
        <p style="margin-top: 0; margin-bottom: 0">Jl. Ir. M. Putuhena, Wailela - Rumah Tiga, Ambon - Maluku </p>
      </div>
    </div>
    <div style="height: 2px; width: 100%; border-bottom: 1px black solid"></div>
    <div style="padding-top: 20px">
      <div style="text-align: center">
        <p style="font-weight: bold">SURAT PERJANJIAN KERJA</p>
        <p style="font-weight: bold">No. Pengajuan RKT : ${params.no_rkt}</p>
      </div>
      <div style="margin-top: 3rem">
        <p>Dalam rangka mewujudkan kinerja yang efektif, transparan, dan akuntabel serta berorientasi pada hasil, kami yang bertandatangan di bawah ini:</p>
        <table style="margin-left: -3px">
          <tr>
            <td width="220">Nama Pegawai</td>
            <td width="15">:</td>
            <td>${params.submit_name}</td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>${params.submit_title}</td>
          </tr>
        </table>
        <p style="margin-top: 0">Untuk selanjutnya disebut PIHAK PERTAMA</p>
        <table style="margin-left: -3px">
          <tr>
            <td width="220">Nama Pegawai</td>
            <td width="15">:</td>
            <td>${params.approver_name}</td>
          </tr>
          <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>${params.approver_title}</td>
          </tr>
        </table>
        <p style="margin-top: 0">Untuk selanjutnya disebut PIHAK KEDUA</p>
      </div>
      <div>
        <p style="margin-top: 1.5rem">PIHAK PERTAMA berjanji akan mewujudkan target kinerja yang seharusnya sesuai
          lampiran perjanjian kinerja ini, dalam rangka mencapai target kinerja jangka menengah
          seperti yang telah ditetapkan dalam dokumen perencanaan. Keberhasilan dan kegagalan
          pencapaian target kinerja tersebut menjadi tanggung jawab kami.</p>
        <p style="margin-top: 1.5rem">PIHAK KEDUA akan melakukan supervisi yang diperlukan serta akan melakukan evaluasi
          terhadap capaian kinerja dari perjanjian kinerja ini dan mengambil tindakan yang diperlukan
          dalam rangka optimalisasi pencapaian target Perjanjian Kinerja tersebut, baik dalam bentuk
          penghargaan maupun teguran.</p>
      </div>
      <div style="margin-top: 3rem">
        <div style="display: flex; justify-content: space-between">
          <div style="margin-top: 1.17rem">
            <div>${params.submit_title}</div>
            <div style="margin-top: 10rem">${params.submit_name}</div>
          </div>
          <div>
            <div>Ambon, ${params.date}</div>
            <div>${params.approver_title}</div>
            <div style="margin-top: 10rem">${params.approver_name}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
