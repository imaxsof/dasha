const path = require('path');
//const mode = process.env.NODE_ENV;

const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.js',
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }, {
        test: /\.js$/,
        loader: 'babel-loader'
      }, {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  devServer: {
    stats: 'errors-only',
    host: '192.168.1.36'
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/page/index.html',
      hash: true
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: 'src/page/404.html',
      hash: true
    }),
  ]
}
