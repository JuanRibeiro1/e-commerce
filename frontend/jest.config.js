module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^react-router-dom$": "<rootDir>/__mocks__/react-router-dom.js"
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
};
