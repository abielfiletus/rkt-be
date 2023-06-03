export const HttpMessage = {
  validationError: "Validation Error",
  badRequest: "Bad Request",
  notFound: "Data tidak ditemukan",
  forbidden: "Anda tidak memiliki akses",
  unauthorized: "Token tidak ada atau sudah kadaluarsa",
  dontNeedVerification: "Data tidak membutuhkan verifikasi",
  cantUpdateCausedVerification: "Data tidak bisa di update karena sudah disetujui",
  cantUpdateCausedSubmitted: "Data tidak bisa di update karena sudah disubmit",
  conflict: (field?: string) => `${field || "Data"} sudah terdaftar`,
};
