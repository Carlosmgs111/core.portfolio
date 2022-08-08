module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  /* fakeTimers: {
    advanceTimers: true,
    enableGlobally: true,
    legacyFakeTimers: false,
    timerLimit: 1000,
  }, */
};
