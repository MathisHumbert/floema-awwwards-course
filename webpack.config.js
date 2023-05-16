const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

const dirApp = path.join(__dirname, 'app');
// const dirAssets = path.join(__dirname, 'assets');
// const dirStyles = path.join(__dirname, 'styles');

console.log(dirApp);

// module.exports = {
//   entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],

//   resolve: {
//     modules: [dirApp, dirAssets, dirStyles],
//   },
// };
