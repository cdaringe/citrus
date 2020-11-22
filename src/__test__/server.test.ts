import { ServerFixture, createFixture } from "./server.fixture";

/**
 * Test frameworks like ava allow users to create a per-test owned datas,
 * such that mutable, scoped state isn't required. In such a system, individual
 * tests can have their own, dedicated memory. Due to jest ubiquity, we demo
 * using jest, even if the setup and teardown mutability isn't as graceful.
 */
let fixture: ServerFixture | null = null;

beforeEach(async () => {
  fixture = await createFixture();
});
afterEach(() => fixture?.server?.close());

describe("server", () => {
  it("should return a fruit on GET /fruit/:id ", async () => {
    fixture?.queryMock?.mockResolvedValue({
      rows: [{ name: "teststrawberry" }],
    });
    const fruit = await fixture?.client?.getFruitById(1).then((r) => r.text());
    expect(fruit).toMatch(/teststrawberry/);
  });
});
