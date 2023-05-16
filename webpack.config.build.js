const path = require('path');

const { CleanWepackPlugin } = require('clean-webpack-plugin');

const { merge } = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
  mode: 'production',

  output: {
    path: path.resolve(__dirname, 'public'),
  },

  plugins: [new CleanWepackPlugin()],
});
