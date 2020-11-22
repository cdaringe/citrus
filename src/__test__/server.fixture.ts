import { createClient } from "../client";
import { createFruitMiddleware, createServer, listen } from "../server";
import Koa from "koa";
import http from "http";
import { Pool } from "pg";
import { getConfig } from "../config";
import getPort from "get-port";
import { Awaited } from "ts-essentials";

export type ServerFixture = Awaited<ReturnType<typeof createFixture>>;

export async function createFixture() {
  const [app, server] = createServer(Koa, http);
  const queryMock = jest.fn();
  const query = queryMock;
  const pool = ({ query } as Partial<Pool>) as Pool;
  const port = await getPort();
  app.use(createFruitMiddleware(pool));
  const config = getConfig({
    ...process.env,
    PORT: `${await getPort()}`,
    DB_USER: "test",
    DB_PASSWORD: "test",
  });
  const client = createClient(config);
  await listen(server, config);
  return {
    client,
    config,
    pool,
    port,
    queryMock,
    server,
  };
}
