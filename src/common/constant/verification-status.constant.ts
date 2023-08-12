export enum VerificationStatus {
  pending = "6",
  no_action = "5",
  approved = "4",
  done = "3",
  revision = "2",
  rejected = "1",
  on_verification = "0",
}

export const VerificationStatusReverse = {
  "0": "on_verification",
  "1": "rejected",
  "2": "revision",
  "3": "done",
  "4": "approved",
  "5": "no_action",
  "6": "pending",
};

export const VerificationStatusExcel = {
  "0": "Proses Verifikasi Oleh ",
  "1": "Ditolak Oleh ",
  "2": "Permintaan Revisi Oleh ",
  "3": "Selesai",
  "4": "Disetujui Oleh ",
  "5": "Tidak ada aksi",
  "6": "butuh Persetujuan Dari ",
};

export const VerificationRoleStep = [2, 3, 4, 5];
export const RejectionRoleTarget = [6, 2, 2, 2];
export const RejectionHistoryDelete = [0, 1, 1, 1];

export enum CapaianStatus {
  un_processed = "0",
  processed = "1",
  complete = "2",
}

export const CapaianStatusReverse = {
  "0": "un_processed",
  "1": "processed",
  "2": "complete",
};

export const CapaianStatusExcel = {
  "0": "Belum Proses",
  "1": "Dalam Proses",
  "2": "Selesai",
};
