/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: ['src/lib/**/*.js'],
};
