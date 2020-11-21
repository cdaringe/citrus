import pg from "pg";
export const createPool = (opts: pg.PoolConfig, db = pg) => new db.Pool(opts);
