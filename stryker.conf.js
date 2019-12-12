module.exports = function(config) {
  config.set({
    mutator: "typescript",
    packageManager: "npm",
    reporters: ["clear-text", "progress"],

    testRunner: "jest",
    jest: {
      config: require('./jest.config.js'),
    },
    transpilers: [],
    coverageAnalysis: "off",
    timeoutMS: 30000,
    timeoutFactor: 4,
    maxConcurrentTestRunners: 6,

    tsconfigFile: "tsconfig.json",
    mutate: ["src/**/*.ts", "src/**/*.tsx"]
  });
};
