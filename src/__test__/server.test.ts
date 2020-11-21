// :|
jest.mock("postgraphile", () => {
  return { postgraphile: () => () => null };
});
// :|
let dbReturnValue: any = null;
// :|
jest.mock("pg", () => {
  function Pool() {}
  Pool.prototype.query = () => Promise.resolve(dbReturnValue);
  return { Pool };
});

import { getFruitById } from "../client";
import { listen, server } from "../server";

// :|
beforeEach(() => listen());
afterEach(() => server.close());

describe("server", () => {
  it("provides a greeting", async () => {
    // :|
    dbReturnValue = { rows: [{ name: "teststrawberry" }] };
    const greeting = await getFruitById(1).then((r) => r.text());
    expect(greeting).toMatch(/teststrawberry/);
  });
});
