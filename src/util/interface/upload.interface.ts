export interface IUploadFile {
  file: Buffer;
  field: string;
  folder: string;
  filename: string;
  ext: string;
  allowedExt: string[];
  allowedSize: string;
}
