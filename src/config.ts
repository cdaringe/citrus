import { String, Number as Num } from "runtypes";
import * as dotenv from "dotenv-safe";
import { resolve } from "path";

dotenv.config({
  path: resolve(__dirname, "..", ".env"),
});

const {
  DB_PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  HOSTNAME,
  NODE_ENV,
  PORT,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
} = process.env;

export const nodeEnv = String.withConstraint(
  (x) => !!x.match(/^(development|production)$/)
).check(NODE_ENV);

export const isDev = nodeEnv === "development";

export const serverPort = Num.withConstraint(
  (i) => Number.isInteger(i) && i > 1000
).check(PORT ? parseInt(PORT) : 7777);

export const serverHostname = String.withConstraint((h) => !!h.length).check(
  HOSTNAME || "localhost"
);

export const dbPort = Num.withConstraint(
  (i) => Number.isInteger(i) && i > 1000
).check(DB_PORT ? parseInt(DB_PORT) : 5432);

export const dbHost = String.withConstraint((h) => !!h.length).check(
  DB_HOST || "localhost"
);

export const dbUser = String.withConstraint((x) => !!x.length).check(
  POSTGRES_USER || DB_USER
);
export const dbPassword = String.withConstraint((x) => !!x.length).check(
  POSTGRES_PASSWORD || DB_PASSWORD
);
