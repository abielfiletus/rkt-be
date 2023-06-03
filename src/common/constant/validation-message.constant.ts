export const ValidationMessage = {
  isNotEmpty: "harus terisi",
  validEmail: "format email tidak valid",
  maxLength: (max: number) => `maksimal ${max} karakter`,
  minLength: (min: number) => `minimal ${min} karakter`,
  number: "harus berupa angka",
  enum: (enums: string[]) => `harus di antara ${enums.join(" ")}`,
  notFound: "tidak ditemukan",
  notMatch: "tidak sesuai",
  alreadyRegistered: "sudah terdaftar",
  validPassword:
    "harus kombinasi dari huruf kecil, huruf besar, angka dan simbol dengan minimal 6 karakter",
  matchField: (field: string) => `harus sama dengan ${field}`,
  matchBetweenField: (...field: string[]) => field.join(" harus sama dengan "),
  extNotAllowed: (...ext: string[]) => `hanya ${ext.join(", ")} yang diperbolehkan`,
  maxSize: (max: string) => `maksimal ${max}`,
};
