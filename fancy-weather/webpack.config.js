const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'none' : 'source-map',
    entry: ['./src/js/index.js', './src/css/style.scss'],
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'main.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: './assets/img',
                name: '[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
      new CopyPlugin([
        { from: './src/assets/img', to: './assets/img' },
      ]),
      new MomentLocalesPlugin({
        localesToKeep: ['es-us', 'ru', 'be'],
      }),
    ],
    devServer: {
      open: true,
      historyApiFallback: true,
      watchContentBase: true,
      contentBase: path.join(__dirname, 'dist'),
    },
  };

  return config;
};
