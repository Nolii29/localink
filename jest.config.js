module.exports = {
    testEnvironment: 'jsdom',
    transform: {},
    moduleFileExtensions: ['js'],
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'src/js/**/*.js',
        '!src/js/main.js', // Skip main entry point
    ],
    coveragePathIgnorePatterns: ['/node_modules/'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
