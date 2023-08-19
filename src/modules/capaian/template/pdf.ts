import { HeaderTemplate } from "../../perjanjian-kerja/template/page-2";
import { currencyFormatter } from "../../../util";

interface IParams {
  logo?: string;
  data: Record<string, any>;
  tw_checked: Array<"1" | "2" | "3" | "4">;
}

export const pdfTemplate = (param: IParams) => {
  const { logo, data, tw_checked } = param;

  const availableWidth = Math.floor((tw_checked.length * 2 - 56) / tw_checked.length);
  let rowspanRkt = 0;
  let table = [];
  let firstAksi = "";

  data.rkt_x_iku.map((iku, j) => {
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
          <td valign="center" rowspan="${rowspanIku}">${iku.iku.name}</td>
          <td valign="center">${iku.iku_x_aksi[0].rencana_aksi}</td>
          <td valign="center" rowspan="${rowspanIku}" >${data.target_perjanjian_kerja}</td>
        ${
          tw_checked.includes("1")
            ? `<td rowspan="${rowspanIku}" >${iku.tw_1}</td>
           <td rowspan="${rowspanIku}" >
             <p class="progress-title">Progress / Kegiatan :</p>
             <p class="progress-value">${iku.capaian.progress_1}</p>
             <p class="progress-title">Kendala :</p>
             <p class="progress-value">${iku.capaian.masalah_1}</p>
             <p class="progress-title">Strategi / Tindak Lanjut :</p>
             <p class="progress-value">${iku.capaian.strategi_1}</p>
           </td>`
            : ""
        }
        ${
          tw_checked.includes("2")
            ? `<td rowspan="${rowspanIku}" >${iku.tw_2}</td>
           <td rowspan="${rowspanIku}" >
             <p class="progress-title">Progress / Kegiatan :</p>
             <p class="progress-value">${iku.capaian.progress_2}</p>
             <p class="progress-title">Kendala :</p>
             <p class="progress-value">${iku.capaian.masalah_2}</p>
             <p class="progress-title">Strategi / Tindak Lanjut :</p>
             <p class="progress-value">${iku.capaian.strategi_2}</p>
           </td>`
            : ""
        }
        ${
          tw_checked.includes("3")
            ? `<td rowspan="${rowspanIku}" >${iku.tw_3}</td>
           <td rowspan="${rowspanIku}" >
             <p class="progress-title">Progress / Kegiatan :</p>
             <p class="progress-value">${iku.capaian.progress_3}</p>
             <p class="progress-title">Kendala :</p>
             <p class="progress-value">${iku.capaian.masalah_3}</p>
             <p class="progress-title">Strategi / Tindak Lanjut :</p>
             <p class="progress-value">${iku.capaian.strategi_3}</p>
           </td>`
            : ""
        }
        ${
          tw_checked.includes("4")
            ? `<td rowspan="${rowspanIku}" >${iku.tw_4}</td>
           <td rowspan="${rowspanIku}" >
             <p class="progress-title">Progress / Kegiatan :</p>
             <p class="progress-value">${iku.capaian.progress_4}</p>
             <p class="progress-title">Kendala :</p>
             <p class="progress-value">${iku.capaian.masalah_4}</p>
             <p class="progress-title">Strategi / Tindak Lanjut :</p>
             <p class="progress-value">${iku.capaian.strategi_4}</p>
           </td>`
            : ""
        }
        </tr>
        ${aksiTable}
      `);
    } else {
      firstAksi += aksiTable;
    }
  });

  const firstIku = data.rkt_x_iku[0];
  const rowspanFirst = firstIku.iku_x_aksi.length;
  table = [
    `
      <tr>
        <td rowspan="${rowspanRkt}" valign="center">${data.id}</td>
        <td rowspan="${rowspanRkt}" valign="center">${data.name}</td>
        <td rowspan="${rowspanFirst}" valign="center">${firstIku.iku.name}</td>
        <td>${firstIku.iku_x_aksi[0].rencana_aksi}</td>
        <td rowspan="${rowspanFirst}" valign="center">${data.target_perjanjian_kerja}</td>
        ${
          tw_checked.includes("1")
            ? `<td rowspan="${rowspanFirst}" valign="center">${firstIku.tw_1}</td>
           <td rowspan="${rowspanFirst}" valign="center">
             <p class="progress-title">Progress / Kegiatan :</p>
             <p class="progress-value">${firstIku.capaian.progress_1}</p>
             <p class="progress-title">Kendala :</p>
             <p class="progress-value">${firstIku.capaian.masalah_1}</p>
             <p class="progress-title">Strategi / Tindak Lanjut :</p>
             <p class="progress-value">${firstIku.capaian.strategi_1}</p>
           </td>`
            : ""
        }
        ${
          tw_checked.includes("2")
            ? `<td rowspan="${rowspanFirst}" valign="center">${firstIku.tw_2}</td>
           <td rowspan="${rowspanFirst}" valign="center">
             <p class="progress-title">Progress / Kegiatan :</p>
             <p class="progress-value">${firstIku.capaian.progress_2}</p>
             <p class="progress-title">Kendala :</p>
             <p class="progress-value">${firstIku.capaian.masalah_2}</p>
             <p class="progress-title">Strategi / Tindak Lanjut :</p>
             <p class="progress-value">${firstIku.capaian.strategi_2}</p>
           </td>`
            : ""
        }
        ${
          tw_checked.includes("3")
            ? `<td rowspan="${rowspanFirst}" valign="center">${firstIku.tw_3}</td>
           <td rowspan="${rowspanFirst}" valign="center">
             <p class="progress-title">Progress / Kegiatan :</p>
             <p class="progress-value">${firstIku.capaian.progress_3}</p>
             <p class="progress-title">Kendala :</p>
             <p class="progress-value">${firstIku.capaian.masalah_3}</p>
             <p class="progress-title">Strategi / Tindak Lanjut :</p>
             <p class="progress-value">${firstIku.capaian.strategi_3}</p>
           </td>`
            : ""
        }
        ${
          tw_checked.includes("4")
            ? `<td rowspan="${rowspanFirst}" valign="center">${firstIku.tw_4}</td>
           <td rowspan="${rowspanFirst}" valign="center">
             <p class="progress-title">Progress / Kegiatan :</p>
             <p class="progress-value">${firstIku.capaian.progress_4}</p>
             <p class="progress-title">Kendala :</p>
             <p class="progress-value">${firstIku.capaian.masalah_4}</p>
             <p class="progress-title">Strategi / Tindak Lanjut :</p>
             <p class="progress-value">${firstIku.capaian.strategi_4}</p>
           </td>`
            : ""
        }
      </tr>
    `,
    firstAksi,
    ...table,
  ];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" />
  <style>
    body {
        font-family: Poppins,sans-serif;
    }
    table {
        border-spacing: 0;
        margin-top: 2rem;
        border-collapse: collapse;
    }
    table tr td {
        border: 0.5px solid rgba(58, 53, 65, 0.12);
        letter-spacing: 0;
        padding: 7px;
    }
    table thead {
        background-color: rgb(249, 250, 252);
        font-size: .75rem;
        text-align: center;
        font-weight: 600;
        color: rgba(58, 53, 65, 0.87);
    }
    table tbody {
        color: rgba(58, 53, 65, 0.68);
        font-size: .875rem;
    }
    .detail {
        box-sizing: border-box;
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        font-size: 13px;
    }
    .detail .title {
        flex-basis: 33.3333%;
        -webkit-box-flex: 0;
        flex-grow: 0;
        max-width: 33.3333%;
        box-sizing: border-box;
        margin: 0;
        flex-direction: row;
        font-weight: 600;
        color: rgba(58, 53, 65, 0.87);
    }
    .detail .value {
        flex-basis: 66.6667%;
        -webkit-box-flex: 0;
        flex-grow: 0;
        max-width: 66.6667%;
        box-sizing: border-box;
        margin: 0;
        flex-direction: row;
        color: rgb(117, 117, 117);
    }
    .progress-title {
        margin-bottom: 0; 
        font-weight: 500; 
        color: rgba(58, 53, 65, 0.87);
    }
    .progress-value {
        margin-top: 0;
    }
  </style>
</head>
<body>
  <div style="margin-top: 10px">
    <div class="detail">
      <div class="title">Tahun Usulan</div>
      <div class="value">${data.tahun}</div>
    </div>
    <div class="detail">
      <div class="title">Pengusul</div>
      <div class="value">${data.user_submit.name}</div>
    </div>
    <div class="detail">
      <div class="title">Nama Usulan Kegiatan</div>
      <div class="value">${data.name}</div>
    </div>
    <div class="detail">
      <div class="title">Usulan Anggaran</div>
      <div class="value">${currencyFormatter.format(data.usulan_anggaran)}</div>
    </div>
    <div class="detail">
      <div class="title">Terget Perjanjian Kerja</div>
      <div class="value">${data.target_perjanjian_kerja}%</div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <td width="1%">ID</td>
        <td width="5%">NAMA KEGIATAN</td>
        <td width="15%">INDIKATOR KINERJA KEGIATAN</td>
        <td width="10%">AKSI</td>
        <td width="2%">TARGET PERJANJIAN</td>
        ${
          tw_checked.includes("1")
            ? `<td width="2%">TARGET TW1</td>
           <td width="${availableWidth}%">ANALISA PROGRESS CAPAIAN TW1</td>`
            : ""
        }
        ${
          tw_checked.includes("2")
            ? `<td width="2%">TARGET TW2</td>
           <td width="${availableWidth}%">ANALISA PROGRESS CAPAIAN TW2</td>`
            : ""
        }
        ${
          tw_checked.includes("3")
            ? `<td width="2%">TARGET TW3</td>
           <td width="${availableWidth}%">ANALISA PROGRESS CAPAIAN TW3</td>`
            : ""
        }
        ${
          tw_checked.includes("4")
            ? `<td width="2%">TARGET TW4</td>
           <td width="${availableWidth}%">ANALISA PROGRESS CAPAIAN TW4</td>`
            : ""
        }
      </tr>
    </thead>
    <tbody>${table.join("")}</tbody>
  </table>
</body>
</html>
`;
};
