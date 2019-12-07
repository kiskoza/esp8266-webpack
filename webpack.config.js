const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

const { CppHeaderTransformPlugin } = require('./lib/cpp_header_transform_plugin.js');

module.exports = (env, args) => {
  return {
    mode: args.mode,
    entry: {
      ...(args.mode == "development" && { "service-worker": './lib/service-worker.js' }),
      main: './web/index.js',
    },
    output: {
      filename: 'data/[name].js',
    },
    plugins: [
      ...fs.readdirSync('./web/')
           .filter((file) => file.endsWith('.html'))
           .map((file) => {
              return new HtmlWebpackPlugin({
                title: 'ESP8266 Web Interface',
                inject: false,
                template: './web/' + file,
                filename: 'data/' + file,
                minify: args.mode === 'production' ? {
                  collapseBooleanAttributes: true,
                  collapseWhitespace: true,
                  removeComments: true,
                  removeRedundantAttributes: true,
                  removeScriptTypeAttributes: true,
                  removeStyleLinkTypeAttributes: true
                } : null,
              });
            }),
      new CppHeaderTransformPlugin(),
    ],
    devServer: {
      historyApiFallback: {
        rewrites: [
          {
            from: /[^.].*$/,
            to: function(context) {
              if(context.parsedUrl.pathname == '/') {
                return '/data/index.html'
              } else if(context.parsedUrl.pathname.split('.').length == 1) {
                return '/data/' + context.parsedUrl.pathname + '.html';
              } else {
                return '/data/' + context.parsedUrl.pathname;
              }
            }
          }
        ]
      }
    }
  };
}
