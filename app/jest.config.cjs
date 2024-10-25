module.exports = {
  preset: "ts-jest", // Use ts-jest for TypeScript support
  testEnvironment: "node", // Use Node.js environment for testing
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"], // Ignore node_modules
};
