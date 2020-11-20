import Koa from "koa";
import { createServer } from "http";
import { getConfig, loadDotEnv } from "./config";
import { postgraphile } from "postgraphile";
import { pool } from "./db";
import { promisify } from "util";

/**
 * @refactor
 * - not GT compliant. future refactor
 */
loadDotEnv();
const { serverHostname, serverPort } = getConfig(process.env);

const app = new Koa();
export const server = createServer(app.callback());

app.use((async (ctx, next) => {
  const [_, id] = ctx.path.match(/fruits\/(\d+)/i) || [];
  if (id)
    ctx.body = await pool
      .query({
        text: `select name from fruits where id = $1 limit 1`,
        values: [id],
      })
      .then((r) => r.rows[0].name);
  return next();
}) as Koa.Middleware);
app.use(postgraphile(pool, ["public"], { graphiql: true }));

export const listen = () =>
  promisify((port: number, hostname: string, cb: () => void) =>
    server.listen(port, hostname, cb)
  )(serverPort, serverHostname);

if (!module.parent)
  listen().then(() =>
    console.log(`started on ${serverHostname}:${serverPort}`)
  );
