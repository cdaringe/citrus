import { getConfig } from "../config";

const KNOWN_GOOD_ENV = {
  DB_PORT: "1234",
  DB_HOST: "test_DB_HOST",
  DB_USER: "test_DB_USER",
  DB_PASSWORD: "test_DB_PASSWORD",
  HOSTNAME: "test_HOSTNAME",
  NODE_ENV: "production",
  PORT: "7890",
  POSTGRES_PASSWORD: "test_POSTGRES_PASSWORD",
  POSTGRES_USER: "test_POSTGRES_USER",
};

describe("config", () => {
  /**
   * @refactor
   * - test positive case
   */
  it(`should accept valid env`, () => {
    expect(() => getConfig(KNOWN_GOOD_ENV)).not.toThrowError();
  });

  // @refactor - drop vm patching malarkey
  // // :|
  // // https://stackoverflow.com/a/48042799/1438908
  // const OLD_ENV = process.env;
  // beforeEach(() => {
  //   jest.resetModules();
  //   // :|
  //   process.env = { ...OLD_ENV, ...KNOWN_GOOD_ENV };
  // });

  // afterAll(() => {
  //   // :|
  //   process.env = OLD_ENV;
  // });

  // @refactor - test provides little value now, pruned
  // it("should not error on import", () => {
  //   expect(() => require("../config")).not.toThrow();
  // });
  [
    {
      case: "bad db pw",
      envPatch: {
        POSTGRES_PASSWORD: "",
        DB_PASSWORD: "",
      },
    },
    {
      case: "bad port",
      envPatch: {
        PORT: "100",
      },
    },
  ].map((opts) =>
    it(`should error on ${opts.case}`, () => {
      /**
       * @refactor
       * - no more env mutations
       * - inputs passed as function inputs
       */
      const env = { ...KNOWN_GOOD_ENV, ...opts.envPatch };
      expect(() => getConfig(env)).toThrowError(/constraint check/);
    })
  );
});
