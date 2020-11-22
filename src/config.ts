import * as runtypes from "runtypes";
import * as dotenv from "dotenv-safe";
import { resolve } from "path";

export const loadDotEnv = () =>
  dotenv.config({
    path: resolve(__dirname, "..", ".env"),
  });

export const getConfig = (
  env: typeof process.env,
  rt: typeof runtypes = runtypes
) => {
  const { String, Number: Num } = rt;
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
  } = env;
  const nodeEnv = String.withConstraint(
    (x) => !!x.match(/^(development|production)$/)
  ).check(NODE_ENV);
  return {
    dbPort: Num.withConstraint((i) => Number.isInteger(i) && i > 1000).check(
      DB_PORT ? parseInt(DB_PORT) : 5432
    ),
    dbHost: String.withConstraint((h) => !!h.length).check(
      DB_HOST || "localhost"
    ),
    dbUser: String.withConstraint((x) => !!x.length).check(
      POSTGRES_USER || DB_USER
    ),
    dbPassword: String.withConstraint((x) => !!x.length).check(
      POSTGRES_PASSWORD || DB_PASSWORD
    ),
    nodeEnv,
    isDev: nodeEnv === "development",
    serverPort: Num.withConstraint(
      (i) => Number.isInteger(i) && i > 1000
    ).check(PORT ? parseInt(PORT) : 7777),
    serverHostname: String.withConstraint((h) => !!h.length).check(
      HOSTNAME || "localhost"
    ),
  };
};

export type Config = ReturnType<typeof getConfig>;
