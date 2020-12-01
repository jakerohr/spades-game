const path = require('path');

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: ['/Users/jrohr/code/misc/spades-game/client/src/styles/global.scss'],
    },
  },
  configureWebpack: (config) => {
    resolve: {
      modules: [path.resolve('/src'), path.resolve('/node_modules')];
    }
  },
};
