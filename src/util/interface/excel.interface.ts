export interface ExcelInitInterface {
  filename: string;
  headerTitle: Record<string, any>;
  rowsData: Array<Record<any, any>>;
  rowsField: Record<string, any>;
  showGridLines: boolean;
}

export interface ExcelWorksheetInterface {
  name: string;
}
