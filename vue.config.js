const path = require('path');

const { readSettings } = require('./SettingsHelper');

const settings = readSettings();

process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  publicPath: settings.webroot,
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-eval-source-map',
    resolve: {
      alias: {
        // Alias @ to /src folder for ES/TS imports
        '@': path.join(__dirname, '/src'),
      },
    },
    node: false,
  },

  // pluginOptions: {
  //   webpackBundleAnalyzer: {
  //     openAnalyzer: false,
  //     analyzerMode: 'server',
  //   },
  // },

  css: {
    extract: process.env.NODE_ENV === 'production' ? {
      ignoreOrder: true,
    } : false,
  },
};
