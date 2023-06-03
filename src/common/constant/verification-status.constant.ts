export enum VerificationStatus {
  approved = "2",
  pending = "1",
  rejected = "3",
  revision = "4",
  no_action = "0",
}

export const VerificationStatusReverse = {
  "0": "no_action",
  "2": "approved",
  "1": "pending",
  "3": "rejected",
  "4": "revision",
};
