import {JestConfigWithTsJest} from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  moduleFileExtensions: ["ts"],
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
  transformIgnorePatterns: [
    'node_modules/(?!(fetch-blob|node-fetch)/)'
  ]
}

export default jestConfig;