const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, args) => {
  return {
    mode: args.mode,
    entry: './web/index.js',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'ESP8266 Web Interface',
        inject: false,
        template: './web/index.html',
        minify: args.mode === 'production' ? {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        } : null,
      }),
    ]
  };
}
