import * as exceljs from "exceljs";
import { ExcelInitInterface, ExcelWorksheetInterface } from "./interface";

const incLetter = (char: string) => {
  if (char[char.length - 1] === "Z") {
    const check = char.length > 1 ? char[char.length - 2] : "";
    if (check !== "") {
      return incLetter(check) + "A";
    } else {
      if (char.length > 1) {
        return `${char.slice(char.length - 1, 1)}AA`;
      } else {
        return "AA";
      }
    }
  }

  let letter = char;

  if (char.length > 1) {
    letter = letter[letter.length - 1];
  }

  letter = String.fromCharCode(letter.charCodeAt(0) + 1);
  if (char.length > 1) {
    return `${char.slice(0, char.length - 1)}${letter}`;
  } else {
    return letter;
  }
};

const numToLetter = (num: number) => {
  let s = "";
  let t;

  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return s || undefined;
};

class Excel {
  private workbook: exceljs.Workbook;
  private headerTitle: Record<string, any>;
  private rowsData: Array<Record<any, any>>;
  private rowsField: Record<string, any>;
  private filename: any;
  private showGridLines: boolean;
  private worksheet: exceljs.Worksheet;

  init(data: ExcelInitInterface) {
    this.workbook = new exceljs.Workbook();
    this.workbook.creator = "ABOINTECH";
    this.workbook.lastModifiedBy = "ADMIN";
    this.workbook.created = new Date(Date.now());
    this.workbook.modified = new Date(Date.now());
    this.workbook.model.title = "EPB SUMMARY REPORT";
    this.workbook.model.category = "Report File";
    this.workbook.model.description = "xlsx file reporting created for SIPOLNAM powered by Abiel";

    this.headerTitle = data.headerTitle;
    this.rowsData = data.rowsData;
    this.rowsField = data.rowsField;
    this.filename = data.filename;
    this.showGridLines = data.showGridLines;
    return this;
  }
  addWorkSheet(data: ExcelWorksheetInterface) {
    this.worksheet = this.workbook.addWorksheet(data.name);
    return this;
  }
  addHeader() {
    const column = [];
    Object.keys(this.headerTitle).map((el) => {
      column.push({
        header: el.replace(/_/, " "),
        key: this.headerTitle[el],
      });
    });
    this.worksheet.columns = column;
    this.worksheet.getRow(1).font = { bold: true };
    this.worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
    this.worksheet.views = [
      {
        state: this.rowsData.length > 8 ? "frozen" : "normal",
        ySplit: 1,
        topLeftCell: "A1",
        activeCell: "A1",
        showGridLines: this.showGridLines,
      },
    ];
    return this;
  }
  addRows() {
    if (this.rowsData.length > 0) {
      for (let j = 0; j < this.rowsData.length; j++) {
        const value = { no: j + 1 };
        Object.keys(this.rowsField).map((el) => {
          value[el] = this.rowsData[j].hasOwnProperty(this.rowsField[el])
            ? this.rowsData[j][this.rowsField[el]]
            : "";
        });
        this.worksheet.addRow(value);
      }
    } else {
      this.worksheet.getCell("A2").value = "Tidak Ada Data.";
      this.worksheet.getCell("A2").font = { italic: true };
      this.worksheet.mergeCells(`A2:${numToLetter(Object.keys(this.rowsField).length + 1)}2`);
      this.worksheet.getCell(`A2`).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
    return this;
  }
  autoSizeColumn() {
    for (let j = 0; j < this.worksheet.columns.length; j++) {
      let dataMax = 0;
      const column = this.worksheet.columns[j];
      column.values.map((el) => {
        el = typeof el !== "string" ? el.toString() : el;
        const columnLength = el.length * 1.2;
        if (columnLength > dataMax) {
          dataMax = columnLength;
        }
      });
      column.width = dataMax < 4 ? 5 : dataMax + 1;
    }
    return this;
  }
  addBgColor() {
    let letter = "A";
    for (let j = 0; j < this.worksheet.columns.length; j++) {
      this.worksheet.getCell(`${letter}1`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFB8D9F0" },
      };
      letter = incLetter(letter);
    }
    return this;
  }
  addBorder() {
    for (let j = 0; j <= this.rowsData.length; j++) {
      let letter = "A";
      for (let k = 0; k < this.worksheet.columns.length; k++) {
        this.worksheet.getCell(`${letter}${j + 1}`).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        this.worksheet.getCell(`${letter}${k + 1}`).alignment = {
          vertical: "middle",
          wrapText: true,
          shrinkToFit: true,
        };
        letter = incLetter(letter);
      }
    }
    return this;
  }
  generate() {
    return this.workbook.xlsx.writeBuffer().then((res) => {
      return {
        buffer: res,
        header: `attachment;filename=${this.filename}.xlsx`,
        filename: this.filename + ".xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
    });
  }
}
export const excel = new Excel();
