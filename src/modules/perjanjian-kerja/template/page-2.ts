interface IParams {
  logo?: string;
  no_rkt?: string;
  usulan_anggaran?: string;
  tahun?: string;
  rkt_data?: Record<string, any>;
}

export const HeaderTemplate = (logo: string) => {
  return `
    <div style="padding-bottom: 10px; border-bottom: 1px black solid">
      <div style="width: 740px; margin-left: auto; margin-right: auto">
        <img src="${logo}" alt="" style="position: absolute; width: 60px; height: 60px">
        <div style="text-align: center; flex-grow: 1;padding-left: 90px;padding-right: 90px">
          <p style="margin-top: 0; margin-bottom: 0; font-size: 1.12rem">KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI</p>
          <p style="font-weight: bold;margin-top: 0; margin-bottom: 0; font-size: 1.12rem">POLITEKNIK NEGERI AMBON</p>
          <small style="text-decoration: underline; font-size: 14px">Jl. Ir. M. Putuhena, Wailela - Rumahtiga Ambon, Tel. (0911) 322715 Fax. (0911) 322715</small>
        </div>
      </div>
    </div>
  `;
};

export const page2Template = (param: IParams) => {
  let rowspanRkt = 0;
  let table = [];
  let firstAksi = "";

  param.rkt_data.rkt_x_iku.map((iku, j) => {
    let rowspanIku = 0;
    let aksiTable = "";

    iku.iku_x_aksi.map((aksi, k) => {
      if (k > 0) {
        aksiTable += `<tr><td>${aksi.rencana_aksi}</td></tr>`;
      }
      rowspanIku++;
      rowspanRkt++;
    });

    if (j > 0) {
      table.push(`
        <tr>
          <td rowspan="${rowspanIku}">${iku.iku.name}</td>
          <td>${iku.iku_x_aksi[0].rencana_aksi}</td>
          <td rowspan="${rowspanIku}" align="center">${iku.total}</td>
          <td rowspan="${rowspanIku}" align="center">${iku.tw_1}</td>
          <td rowspan="${rowspanIku}" align="center">${iku.tw_2}</td>
          <td rowspan="${rowspanIku}" align="center">${iku.tw_3}</td>
          <td rowspan="${rowspanIku}" align="center">${iku.tw_4}</td>
        </tr>
        ${aksiTable}
      `);
    } else {
      firstAksi += aksiTable;
    }
  });

  const firstIku = param.rkt_data.rkt_x_iku[0];
  const rowspanFirst = firstIku.iku_x_aksi.length;
  table = [
    `
      <tr>
        <td rowspan="${rowspanRkt}" style="vertical-align: center">${param.rkt_data.name}</td>
        <td rowspan="${rowspanFirst}">${firstIku.iku.name}</td>
        <td>${firstIku.iku_x_aksi[0].rencana_aksi}</td>
        <td rowspan="${rowspanFirst}" align="center">${firstIku.total}</td>
        <td rowspan="${rowspanFirst}" align="center">${firstIku.tw_1}</td>
        <td rowspan="${rowspanFirst}" align="center">${firstIku.tw_2}</td>
        <td rowspan="${rowspanFirst}" align="center">${firstIku.tw_3}</td>
        <td rowspan="${rowspanFirst}" align="center">${firstIku.tw_4}</td>
      </tr>
    `,
    firstAksi,
    ...table,
  ];
  // console.log(table);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" />
  <title>Draft PK ${param}</title>
  <style>
      body {
          font-family: "Roboto", sans-serif;
          padding: 1.5rem;
          position: relative;
      }
      table {
          border-collapse: collapse;
      }
      table tr td {
          border: 0.870701px solid #03014C;
          padding: 10px;
      }
  </style>
</head>
<body>
<div style="position:relative;">
  ${HeaderTemplate(param.logo)}
  <div style="padding-top: 10px">
    <div style="text-align: center">
      <p style="font-weight: bold; margin-bottom: 0">TARGET KINERJA</p>
    </div>
    <div style="margin-top: 1rem">
      <div style="display: flex">
        <div style="width: 150px">No. Pengajuan RKT</div>
        <div style="width: 20px">:</div>
        <div>${param.no_rkt}</div>
      </div>
      <div style="display: flex; margin-top: 5px; margin-bottom: 5px">
        <div style="width: 150px">Usulan Anggaran</div>
        <div style="width: 20px">:</div>
        <div>${param.usulan_anggaran}</div>
      </div>
      <div style="display: flex">
        <div style="width: 150px">Tahun Usulan</div>
        <div style="width: 20px">:</div>
        <div>${param.tahun}</div>
      </div>
    </div>
  </div>
  <div style="margin-top: 30px">
    <table width="100%">
      <thead>
        <tr style="font-weight: 500; text-align: center">
          <td width="150">Nama Kegiatan</td>
          <td>Indikator Kinerja Kegiatan</td>
          <td>Aksi</td>
          <td width="70">Target Perjanjian </td>
          <td width="40">TW 1</td>
          <td width="40">TW 2</td>
          <td width="40">TW 3</td>
          <td width="40">TW 4</td>
        </tr>
      </thead>
      <tbody style="font-size: 13px">${table.join("")}</tbody>
    </table>
  </div>
</div>
</body>
</html>`;
};
