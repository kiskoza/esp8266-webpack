const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

var dotenv = require('dotenv').config({path: __dirname + '/.env'});

class CppHeaderTransformPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('CppHeaderTransformPlugin', (compilation, callback) => {
      var cpp_header = 'const char* html = "';
      cpp_header += compilation.assets['index.html'].source().toString().replace(/"/g, '\\"');
      cpp_header += '";';

      compilation.assets['index.html.h'] = {
        source: function() {
          return cpp_header;
        },
        size: function() {
          return cpp_header.length;
        }
      };

      var secrets = '';
      secrets += '#define STASSID "' + dotenv.parsed.SSID + '"\n';
      secrets += '#define STAPSK  "' + dotenv.parsed.PASSWORD + '"\n'

      compilation.assets['secrets.h'] = {
        source: function() {
          return secrets;
        },
        size: function() {
          return secrets.length;
        }
      }

      callback();
    });
  }
}

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
      new CppHeaderTransformPlugin(),
    ]
  };
}
