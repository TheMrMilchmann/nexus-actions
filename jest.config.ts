import {JestConfigWithTsJest} from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  testEnvironment: "node",
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        useESM: true,
      }
    ]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(fetch-blob|node-fetch)/)'
  ]
}

export default jestConfig;