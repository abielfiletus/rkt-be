import { Sequelize } from "sequelize-typescript";

export const dbRawInstance = () => {
  const user = process.env.DB_USERNAME;
  const pass = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const db = process.env.DB_NAME;
  return new Sequelize(`postgres://${user}:${pass}@${host}:${port}/${db}`, {
    logging: process.env.DB_LOGGING === "true",
  });
};
