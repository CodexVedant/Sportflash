module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@context': './src/context',
            '@services': './src/services',
            '@navigation': './src/navigation',
            '@config': './src/config',
            '@store': './src/store',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
