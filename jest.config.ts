import {JestConfigWithTsJest} from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  automock: false,
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  testEnvironment: "node",
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: "./tsconfig.test.json"
      }
    ]
  },
  verbose: true
}

export default jestConfig;