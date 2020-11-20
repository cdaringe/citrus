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
  // :|
  // https://stackoverflow.com/a/48042799/1438908
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    // :|
    process.env = { ...OLD_ENV, ...KNOWN_GOOD_ENV };
  });

  afterAll(() => {
    // :|
    process.env = OLD_ENV;
  });

  it("should not error on import", () => {
    expect(() => require("../config")).not.toThrow();
  });
  [
    {
      case: "bad db pw",
      envPatch: {
        POSTGRES_PASSWORD: "",
        DB_PASSWORD: "",
      },
      errorMatch: /env.example/,
    },
    {
      case: "bad port",
      envPatch: {
        PORT: "100",
      },
      errorMatch: /constraint check/,
    },
  ].map((opts) =>
    it(`should error on ${opts.case}`, () => {
      // :|
      process.env = { ...process.env, ...opts.envPatch };
      expect(() => require("../config")).toThrowError(opts.errorMatch);
    })
  );
});
