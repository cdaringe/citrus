import pg from "pg";
import { dbHost, dbPassword, dbPort, dbUser } from "./config";

export const pool = new pg.Pool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
});
