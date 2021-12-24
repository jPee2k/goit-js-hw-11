const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const srcDir = fs.readdirSync(path.resolve(__dirname, 'src'));
const multipleHtmlPlugins = srcDir.filter((file) => file.match(/\.html$/)).map((html) => {
  return new HtmlWebpackPlugin({
    filename: path.resolve(__dirname, `dist/${html}`),
    template: `src/${html}`,
  });
});

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  entry: {
    app: path.resolve(__dirname, 'src/js/index.js'),
  },
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist/'),
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist/'),
    watchContentBase: true,
    liveReload: true,
  },
  stats: {
    children: true,
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.html$/, use: ['html-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.s[ac]ss$/i, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] },
      { test: /\.hbs$/, loader: 'handlebars-loader' },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        parser: { dataUrlCondition: { maxSize: 8192 } },
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(ttf|eot)(\?[\s\S]+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(svg|jpeg|jpg|png|webp|gif)(\?[\s\S]+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
    ],
  },
  plugins: [...multipleHtmlPlugins,
    new MiniCssExtractPlugin({
      filename: 'css/bundle.css',
    }),
  ],
};
