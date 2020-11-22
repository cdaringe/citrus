import Koa from "koa";
import http, { Server } from "http";
import type { Config } from "./config";
import { postgraphile } from "postgraphile";
import type { Pool } from "pg";

type Http = typeof http;
type GqlMiddleware = typeof postgraphile;
type WithApp = { app: Koa };
type WithPool = { pool: Pool };
type WithGql = { gqlMiddleware: GqlMiddleware };
type WithCreateMiddlewares = { createMiddlewares: typeof createMiddlewares };

export const createServer = (App: typeof Koa, { createServer }: Http) => {
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
  createMiddlewares,
  bind,
  ...rest
}: WithApp &
  WithPool &
  WithGql &
  WithCreateMiddlewares & {
    bind: (mws: Koa.Middleware[]) => void;
  }) => bind(createMiddlewares(rest));

export const listen = (
  server: Server,
  { serverPort, serverHostname }: Config
) => new Promise((res) => server.listen(serverPort, serverHostname, res));
