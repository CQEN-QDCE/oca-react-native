const { defaults } = require('jest-config');
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!.*react-native.*)'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
};
