import Koa from "koa";
import http, { Server } from "http";
import type { Config } from "./config";
import { postgraphile } from "postgraphile";
import type { Pool } from "pg";

type GqlMiddleware = typeof postgraphile;
type Http = typeof http;
type KoaConstructor = typeof Koa;
type WithApp = { app: Koa };
type WithGql = { gqlMiddleware: GqlMiddleware };
type WithPool = { pool: Pool };

export const createServer = (App: KoaConstructor, { createServer }: Http) => {
  const app = new App();
  const server = createServer(app.callback());
  return [app, server] as const;
};

export const createFruitMiddleware: (pool: Pool) => Koa.Middleware = (
  pool
) => async (ctx, next) => {
  const [_, id] = ctx.path.match(/fruits\/(\d+)/i) || [];
  if (id)
    ctx.body = await pool
      .query({
        text: `select name from fruits where id = $1 limit 1`,
        values: [id],
      })
      .then((r) => r.rows[0].name);
  return next();
};

export const createMiddlewares = ({
  pool,
  gqlMiddleware,
}: WithPool & WithGql) => [
  createFruitMiddleware(pool),
  gqlMiddleware(pool, ["public"], { graphiql: true }),
];

export const bindMiddlewares = ({
  app,
  ...rest
}: WithApp & WithPool & WithGql) => createMiddlewares(rest).forEach(app.use);

export const listen = (
  server: Server,
  { serverPort, serverHostname }: Config
) => new Promise((res) => server.listen(serverPort, serverHostname, res));
