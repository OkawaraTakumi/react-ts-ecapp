module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "moduleNameMapper":{
        '\\.(jpg|jpeg|png|gif|svg)':'<rootDir>/mocks/fileMock.js',
        '\\.(css|less)':'<rootDir>/mocks/fileMock.js'
    },
    "testEnvironment": "jsdom"
  }