const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

var dotenv = require('dotenv').config({path: __dirname + '/.env'});

class CppHeaderTransformPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('CppHeaderTransformPlugin', (compilation, callback) => {
      var main_header = '';

      Object.keys(compilation.assets)
        .filter((file) => file.endsWith('.html'))
        .map((file) => {
          var cpp_header = 'const char* ';
          cpp_header += file.replace(/\./g, '_');
          cpp_header += ' = "';
          cpp_header += compilation.assets[file].source().toString().replace(/"/g, '\\"');
          cpp_header += '";';

          compilation.assets[file + '.h'] = {
            source: function() {
              return cpp_header;
            },
            size: function() {
              return cpp_header.length;
            }
          };

          main_header += '#include "' + file + '.h"\n';
        });

      compilation.assets['html.h'] = {
        source: function() {
          return main_header;
        },
        size: function() {
          return main_header.length;
        }
      }

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
      ...fs.readdirSync('./web/')
           .filter((file) => file.endsWith('.html'))
           .map((file) => {
              return new HtmlWebpackPlugin({
                title: 'ESP8266 Web Interface',
                inject: false,
                template: './web/' + file,
                filename: file,
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
    ]
  };
}
