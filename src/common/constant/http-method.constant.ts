export enum HttpMethod {
  POST = "Create",
  GET = "Read",
  PUT = "Update",
  PATCH = "Update",
  DELETE = "Delete",
  APPROVE = "Approve",
  DOWNLOAD = "Download",
}

export const StatusMessage = {
  200: "Sukses",
  201: "Sukses",
  400: "Bad Request",
  404: "Tidak Ditemukan",
  422: "Validation Error",
  500: "Internal Server Error",
};
