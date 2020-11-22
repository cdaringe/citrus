import { getConfig, loadDotEnv } from "./config";
import { Pool } from "pg";
import { bindMiddlewares, createServer, listen } from "./server";
import Koa from "koa";
import http from "http";
import postgraphile from "postgraphile";

async function start() {
  /* prepare resources */
  loadDotEnv();
  const config = getConfig(process.env);
  const {
    serverHostname,
    serverPort,
    dbHost,
    dbPassword,
    dbPort,
    dbUser,
  } = config;
  const pool = new Pool({
    host: dbHost,
    password: dbPassword,
    port: dbPort,
    user: dbUser,
  });
  const [app, server] = createServer(Koa, http);
  bindMiddlewares({ app, pool, gqlMiddleware: postgraphile });

  /* execute GT entry point */
  await listen(server, config);
  console.log(`started on ${serverHostname}:${serverPort}`);
}

start();
