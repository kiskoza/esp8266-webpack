const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const changeCase = require('change-case');

var dotenv = require('dotenv').config({path: __dirname + '/.env'});

class CppHeaderTransformPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('CppHeaderTransformPlugin', (compilation, callback) => {
      var main_header = '';

      Object.keys(compilation.assets)
        .filter((file) => file.endsWith('.html') || file.endsWith('.js'))
        .map((file) => {
          var h_file = file.split('/')[1] || file;

          const guardName = h_file.replace(/\./g, '_').toUpperCase();
          const className = changeCase.pascal(h_file);

          const keys = (compilation.assets[file].source().toString()
            .match(/%[A-Z]*%/g) || [])
            .map((el) => { return el.replace(/%/g, '') })
            .filter((v, i, a) => { return a.indexOf(v) === i })
            .sort();

          var cpp_header = '';
          cpp_header += '#ifndef ' + guardName + '_H\n';
          cpp_header += '#define ' + guardName + '_H\n';
          cpp_header += '\n';
          cpp_header += '#include "template_page.h"\n';
          cpp_header += '\n';
          cpp_header += 'class ' + className +' : public TemplatePage {\n'
          keys.map((key) => {
            cpp_header += '  String& ' + key.toLowerCase() + ';\n';
          });
          cpp_header += 'public:\n';
          cpp_header += '  ' + className + '('
          cpp_header += keys.map((key) => {
                              return 'String& _' + key.toLowerCase();
                            }).join(', ');
          cpp_header += ') :\n';
          cpp_header += '    TemplatePage("/' + h_file + '")';
          keys.map((key) => {
            cpp_header += ',\n    ' + key.toLowerCase() + '(_' + key.toLowerCase() + ')'
          });
          cpp_header += ' {}\n';
          cpp_header += '\n';
          cpp_header += '  String& params(const String& param) {\n    ';
          keys.map((key) => {
            cpp_header += 'if(param == "' + key + '") {\n';
            cpp_header += '      return ' + key.toLowerCase() + ';\n';
            cpp_header += '    } else ';
          });
          cpp_header += '{\n';
          cpp_header += '      return empty;\n';
          cpp_header += '    }\n';
          cpp_header += '  }\n';
          cpp_header += '};\n';
          cpp_header += '\n';
          cpp_header += '#endif\n';

          compilation.assets[h_file + '.h'] = {
            source: function() {
              return cpp_header;
            },
            size: function() {
              return cpp_header.length;
            }
          };

          main_header += '#include "' + h_file + '.h"\n';
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
    output: {
      filename: 'data/main.js',
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
