// :|
jest.mock("postgraphile", () => {
  return { postgraphile: () => () => null };
});
// :|
let dbReturnValue: any = null;
// :|
jest.mock("../db", () => {
  return {
    pool: {
      query: async () => {
        return dbReturnValue;
      },
    },
  };
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
