const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

const { CppHeaderTransformPlugin } = require('./lib/cpp_header_transform_plugin.js');

module.exports = (env, args) => {
  return {
    mode: args.mode,
    entry: {
      ...(args.mode == "development" && { "service-worker": './lib/dev-server/service-worker.js' }),
      ...(args.mode == "development" && { "state-mock": './lib/dev-server/state-mock.js' }),
      main: './web/main.js',
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
      ...(args.mode == "development" ? [
            new HtmlWebpackPlugin({
              inject: false,
              template: './lib/dev-server/dev-server.html',
              filename: 'data/dev-server.html',
              minify: null,
            })] : []),
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
