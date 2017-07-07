var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var extractCss = new ExtractTextPlugin('css/style.css')

module.exports = {
  entry: './examples/main.js',
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      main: path.resolve(__dirname, '../src')
    },
  },
  output: {
    path: path.resolve(__dirname, '../dist/dev'),
    publicPath: '/',
    filename: 'index.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist/dev'),
    compress: false,
    port: 8080
  },
  plugins: [
    extractCss,
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/dev/index.html'),
      template: 'examples/index.html',
      inject: true
    })
  ],
  module: {
    loaders: [{
      test: /\.vue$/,
      use: {
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: extractCss.extract({
              use: ['css-loader', 'sass-loader']
            })
          }
        }
      }
    }, {
      test: /\.js$/,
      loaders: ['babel-loader', 'eslint-loader'],
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'fonts/[name].[hash:7].[ext]'
      }
    }]
  }
}
