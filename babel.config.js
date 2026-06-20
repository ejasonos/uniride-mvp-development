module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@components': './src/components',
            '@services': './src/services',
            '@store': './src/store',
            '@constants': './src/constants',
            '@styles': './src/styles',
            '@types': './src/types'
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};