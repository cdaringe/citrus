import { createClient, Client } from "../client";
import { createFruitMiddleware, createServer, listen } from "../server";
import Koa from "koa";
import http, { Server } from "http";
import { Pool } from "pg";
import { getConfig } from "../config";
import getPort from "get-port";

// Test frameworks like ava allow users to create a per-test test context datas,
// such that mutable, scoped state isn't required. In such a system, individual
// tests can have their own, dedicated memory. Due to jest ubiquity, we demo
// using jest, even if the setup and teardown mutability isn't as graceful.
let app: Koa | null = null;
let client: Client | null = null;
let port = 0;
let queryMock: jest.Mock | null = null;
let server: Server | null = null;

beforeEach(async () => {
  [app, server] = createServer(Koa, http);
  const query = (queryMock = jest.fn());
  const pool = ({ query } as Partial<Pool>) as Pool;
  port = await getPort();
  app.use(createFruitMiddleware(pool));
  const config = getConfig({
    ...process.env,
    PORT: `${await getPort()}`,
    DB_USER: "test",
    DB_PASSWORD: "test",
  });
  client = createClient(config);
  await listen(server, config);
});
afterEach(() => server?.close());

describe("server", () => {
  it("should return a fruit on GET /fruit/:id ", async () => {
    queryMock?.mockResolvedValue({ rows: [{ name: "teststrawberry" }] });
    const fruit = await client?.getFruitById(1).then((r) => r.text());
    expect(fruit).toMatch(/teststrawberry/);
  });
});
