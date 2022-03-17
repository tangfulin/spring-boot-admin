const path = require('path');

module.exports = {
  "stories": [
    "../src/main/frontend/components/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    '@storybook/addon-postcss',
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve = {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        "@": path.resolve(__dirname, '../src/main/frontend'),
      },
      extensions: ['.ts', '.js', '.vue'],
    }

    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: require('../postcss.config'),
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  },
}
