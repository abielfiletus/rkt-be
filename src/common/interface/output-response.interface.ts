export interface IOutputResponse {
  code: number;
  msg: string;
  status: boolean;
  data?: Record<string, any> | Array<Record<string, any>> | null;
  error?: Record<string, any> | string;
}
